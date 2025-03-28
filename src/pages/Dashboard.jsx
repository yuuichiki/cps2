
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "@/components/ui/use-toast";
import { File, FileUp } from 'lucide-react';

import DataGrid, {
  Column,
  Editing,
  Paging,
  Popup,
  Form,
} from 'devextreme-react/data-grid';

import { Popup as LogPopup } from 'devextreme-react/popup'; 
import { Item } from 'devextreme-react/form';
import { 
  getCpsData, 
  updateCpsState, 
  removeCPS, 
  updateCps, 
  insertCps, 
  getLog, 
  requestReUploadFile, 
  confirmReUploadFile, 
  uploadFile 
} from '@/services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [dataSource, setDataSource] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupContent, setPopupContent] = useState('');
  const [currentRowId, setCurrentRowId] = useState(null);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (user) {
      try {
        const data = await getCpsData(user.id, user.token);
        setDataSource(data);
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load data. Please try again.",
        });
      }
    }
  };

  // Dropdown items for various fields
  const unreadItems = ['Unread'];
  const mcdtrackingItems = ['Waiting Confirm', 'Confirm receipt', 'Cancel/Other', 'Return'];
  const mcdResponseItems = ['Modify text description', 'Modify physical material information', 'Modify text description and physical material information', 'Cancel'];
  
  const labtrackingItems = ['Waiting Confirm', 'Confirm receipt', 'Return', 'Complete', 'Call back to modify', 'Cancel'];
  const labResponseItems = ['PPC schedule is unreasonable', 'MCD delayed providing the color chart', 'Material delayed to the factory', 'Other'];
  
  const ppcReturnTypeItems = ['Standard products', 'Sample product'];
  const ppcResponseItems = ['Customer cancels order', 'Transfer factory', 'Other'];

  // Options for select boxes
  const mcdtrackingOptions = { items: mcdtrackingItems };
  const mcdResponseOptions = { items: mcdResponseItems };
  const labtrackingOptions = { items: labtrackingItems };
  const labResponseOptions = { items: labResponseItems };
  const ppcReturnTypeItemsOptions = { items: ppcReturnTypeItems };
  const ppcResponseOptions = { items: ppcResponseItems };

  const status = ['Waiting', 'Accept', 'Reject', 'Return'];
  const statusOptions = { items: status };

  const handleGetLog = async (userId, cpId) => {
    try {
      const response = await getLog(userId, cpId);
      const logEntries = response.map(log => {
        return `
          <div>
            ${log.operation === "Upload File" ? `
              <strong>Date:</strong> Thêm mới File Upload
              <a
                href="${log.logMessage}"
                target="_blank"
                rel="noopener noreferrer"
                download="${(() => {
                  if (log.logMessage) {
                    const fileName = log.logMessage.split('/').pop();
                    return fileName;
                  }
                })()}"
                style="text-decoration: none; color: blue; cursor: pointer;">
                [${log.logMessage.split('/').pop()}]
              </a>
            ` : `
              <p><strong>Message:</strong> ${log.logMessage}</p>
            `}
            <p><strong>Date:</strong> ${new Date(log.operationDate).toLocaleString()}</p>
            <p><strong>Operation:</strong> ${log.operation}</p>
            <p><strong>Operated By:</strong> ${log.operatedBy}</p>
          </div>
          <hr />
        `;
      }).join('');
      setPopupContent(logEntries);
      setPopupVisible(true);
    } catch (error) {
      console.error('Error fetching log:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load log data.",
      });
    }
  };

  const handleRequestReUploadFile = async (userId, cpId) => {
    try {
      await requestReUploadFile(userId, cpId);
      toast({
        title: "Success",
        description: "Re-upload request sent successfully.",
      });
      loadData();
    } catch (error) {
      console.error('Error requesting re-upload:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to request re-upload.",
      });
    }
  };

  const handleConfirmReUploadFile = async (userId, cpId, confirm) => {
    try {
      await confirmReUploadFile(userId, cpId, confirm);
      toast({
        title: "Success",
        description: confirm ? 'Re-upload confirmed successfully!' : 'Re-upload rejected successfully!',
      });
      loadData();
    } catch (error) {
      console.error('Error confirming re-upload:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to confirm re-upload.",
      });
    }
  };

  const onShowing = () => {
    if (currentRowId && user) {
      const userData = user.roles ? user.roles.split(',') : [];
      const currentItem = dataSource.find(item => item.id === currentRowId);
      
      if (currentItem && userData.includes('MCD') && currentItem.mcdTracking === 'Unread') {
        updateCpsState(user.id, 1, mcdtrackingItems[0], currentRowId).then(() => {
          // State updated
        }).catch(error => {
          console.error('Error updating state:', error);
        });
      }
      
      if (currentItem && userData.includes('LAB') && currentItem.labTracking === 'Unread') {
        updateCpsState(user.id, 2, labtrackingItems[0], currentRowId).then(() => {
          // State updated
        }).catch(error => {
          console.error('Error updating state:', error);
        });
      }
    }
  };

  const onEditorPreparing = (e) => {
    if (!user) return;
    
    e.editorOptions.disabled = true;
    const userData = user.roles ? user.roles.split(',') : [];
    
    if (e.parentType === 'dataRow' && userData.includes('PPC')) {
      if (['workshop', 'customer', 'styleNo', 'color', 'colorName', 'materialArrivalDate', 'submissionDate', 'fcpSubmissionDate'].includes(e.dataField)) {
        if (e.row.data.mcdTracking === 'Unread' || e.row.isNewRow) {
          e.editorOptions.disabled = false;
          e.editorElement.style.backgroundColor = 'lightgreen';
        }
      }
      
      if (['ppcResponse', 'ppcNote', 'ppcTypeSelect', 'ppcPhone', 'ppcFinished'].includes(e.dataField)) {
        if (e.row.data.labTracking !== 'Unread' && e.row.data.labTracking !== null && e.row.data.labTracking !== undefined) {
          e.editorOptions.disabled = false;
          e.editorElement.style.backgroundColor = 'lightgreen';
          e.row.data.ppcResponder = user.id;
        }
      }
    }
    
    if (e.parentType === 'dataRow' && userData.includes('MCD')) {
      if (['mcdTracking', 'mcdResponse', 'mcdNote'].includes(e.dataField)) {
        if (e.row.data.labTracking === 'Unread' || e.row.data.labTracking === null || e.row.data.labTracking === 'null') {
          e.editorOptions.disabled = false;
          e.editorElement.style.backgroundColor = 'lightgreen';
        }
      }
    }
    
    if (e.parentType === 'dataRow' && userData.includes('LAB')) {
      if (['labTracking', 'labResponse', 'labNote'].includes(e.dataField)) {
        if (e.row.data.ppcTypeSelect === null || e.row.data.ppcTypeSelect === 'null') {
          e.editorElement.style.backgroundColor = 'lightgreen';
          e.editorOptions.disabled = false;
        }
      }
    }
  };

  const handleRowRemoving = async (e) => {
    if (!user) return;
    
    try {
      await removeCPS(user.id, e.data.id);
      toast({
        title: "Success",
        description: "Record deleted successfully.",
      });
    } catch (error) {
      console.error('Error removing CPS:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete record.",
      });
    }
  };

  const handleSaving = async (e) => {
    if (!user) return;
    
    const changes = e.changes;
    for (const change of changes) {
      try {
        if (change.type === 'update') {
          const key = change.key;
          const values = JSON.stringify(change.data);
          
          await updateCps(user.id, key, values);
          toast({
            title: "Success",
            description: "Record updated successfully.",
          });
        }
        
        if (change.type === 'insert') {
          const key = change.key;
          const values = JSON.stringify(change.data);
          
          await insertCps(user.id, key, values);
          toast({
            title: "Success",
            description: "Record created successfully.",
          });
        }
      } catch (error) {
        console.error('Error saving data:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to save changes.",
        });
      }
    }
    
    loadData();
  };

  const renderTracking = (cellData) => {
    const style = {
      backgroundColor: cellData.value === 'Unread' ? 'yellow' : 'transparent',
    };
    return <div style={style}>{cellData.value}</div>;
  };

  const renderLabResponseCell = (cellData) => {
    const style = {
      backgroundColor: cellData.value === 'Waiting' ? 'red' : 'transparent',
      color: cellData.value === 'Waiting' ? 'white' : 'black',
    };
    return <div style={style}>{cellData.value}</div>;
  };

  const renderMCDResponseItem = (itemData) => {
    const style = {
      backgroundColor: itemData.editorOptions.value === 'Waiting' ? 'red' : 'transparent',
      color: itemData.editorOptions.value === 'Waiting' ? 'white' : 'black',
    };
    return <div style={style}>{itemData.value}</div>;
  };

  const renderLabResponseItem = (itemData) => {
    const style = {
      backgroundColor: itemData.editorOptions.value === 'Waiting' ? 'red' : 'transparent',
      color: itemData.editorOptions.value === 'Waiting' ? 'white' : 'black',
    };
    return <div style={style}>{itemData.value}</div>;
  };

  const handleMcdTrackingChange = (newValue) => {
    if (newValue === 'Unread') {
      return 'Waiting Confirm';
    }
    return newValue;
  };

  const renderMcdTrackingItem = (itemData) => {
    const style = {
      backgroundColor: itemData.editorOptions.value === 'Unread' ? 'yellow' : 'Green',
      color: itemData.editorOptions.value === 'Unread' ? 'black' : 'black',
    };
    return (
      <div style={style}>
        <select
          value={itemData.editorOptions.value}
          onChange={(e) => itemData.editorOptions.onValueChanged(handleMcdTrackingChange(e.target.value))}
        >
          {mcdtrackingItems.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  };

  const handleFileUpload = async (e, rowData) => {
    if (!user) return;
    
    const fileInput = e.target.files[0];
    if (fileInput) {
      const formData = new FormData();
      formData.append('file', fileInput);
      formData.append('id', rowData.id);
      formData.append('userid', user.id);
      
      try {
        await uploadFile(formData);
        toast({
          title: "Success",
          description: "File uploaded successfully!",
        });
        loadData();
      } catch (error) {
        console.error('Error uploading file:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to upload file.",
        });
      }
    }
  };

  const renderAttachmentButton = (cellData) => {
    if (!user) return null;
    
    const userData = user.roles ? user.roles.split(',') : [];
    const isFileUploaded = !!cellData.value;
    
    if (userData.includes('MCD')) {
      return (
        <div>
          <input
            type="file"
            style={{ display: 'none' }}
            id={`file-upload-${cellData.data.id}`}
            onChange={(e) => handleFileUpload(e, cellData.data)}
            disabled={isFileUploaded && !cellData.data.confirmUploadFile}
          />
          
          {isFileUploaded && (
            <a
              href={cellData.value}
              target="_blank"
              rel="noopener noreferrer"
              download={(() => {
                if (cellData.value) {
                  const fileName = cellData.value.split('/').pop();
                  return fileName;
                }
              })()}
              style={{ textDecoration: "none", color: "blue", cursor: "pointer" }}
            >
              [{cellData.value.split('/').pop()}]
            </a>
          )}

          {(!isFileUploaded || cellData.data.confirmUploadFile) && (
            <button 
              onClick={() => document.getElementById(`file-upload-${cellData.data.id}`).click()}
              style={{ borderRadius: '12px', padding: '5px 10px' }}
            >
              Upload Attachment
            </button>
          )}
          
          {(isFileUploaded && cellData.data.confirmUploadFile === false) && (
            <div style={{ color: 'orange' }}>
              Upload file request was rejected
            </div>
          )}

          {isFileUploaded && (cellData.data.confirmUploadFile === null || cellData.data.confirmUploadFile === false) && (
            <button
              onClick={() => handleRequestReUploadFile(user.id, cellData.key)}
              disabled={cellData.data.requestUploadFile && cellData.data.requestUploadFile === true && cellData.data.confirmUploadFile === null}
              style={{ borderRadius: '12px', padding: '5px 10px', marginTop: '5px' }}
            >
              {cellData.data.requestUploadFile && cellData.data.requestUploadFile === true && cellData.data.confirmReUploadFile
                ? 'Request was sent'
                : 'Request Re-Upload'}
            </button>
          )}
        </div>
      );
    } else if (userData.includes('MCD-Admin')) {
      return (
        <div>
          {isFileUploaded && (
            <a
              href={cellData.value}
              download={(() => {
                if (cellData.value) {
                  const fileName = cellData.value.split('\\').pop();
                  return fileName;
                }
              })()}
              style={{ textDecoration: "none", color: "blue", cursor: "pointer" }}
            >
              {cellData.value.split('\\').pop()}
            </a>
          )}
          
          {isFileUploaded && cellData.data.requestUploadFile && cellData.data.requestUploadFile === true && cellData.data.confirmUploadFile === null && (
            <div>
              <hr />
              <p>Confirm Re-upload File:</p>
              <label>
                <input
                  type="radio"
                  name={`confirm-reupload-${cellData.key}`}
                  value="yes"
                  onChange={() => {
                    handleConfirmReUploadFile(user.id, cellData.key, true);
                    cellData.data.requestUploadFile = false;
                  }}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name={`confirm-reupload-${cellData.key}`}
                  value="no"
                  onChange={() => {
                    handleConfirmReUploadFile(user.id, cellData.key, false);
                    cellData.data.requestUploadFile = false;
                  }}
                />
                No
              </label>
            </div>
          )}
        </div>
      );
    } else {
      return (
        isFileUploaded && (
          <a
            href={cellData.value}
            download={(() => {
              if (cellData.value) {
                const fileName = cellData.value.split('\\').pop();
                return fileName;
              }
            })()}
            style={{ textDecoration: "none", color: "blue", cursor: "pointer" }}
          >
            {cellData.value.split('\\').pop()}
          </a>
        )
      );
    }
  };

  const onEditingStart = (e) => {
    setCurrentRowId(e.data.id);
  };

  const onEditingCancel = () => {
    loadData();
  };

  return (
    <React.Fragment>
      <DataGrid
        id="gridContainer"
        dataSource={dataSource}
        onEditorPreparing={onEditorPreparing}
        onRowRemoving={handleRowRemoving} 
        onInitNewRow={() => console.log('InitNewRow')}
        onRowInserting={() => console.log('RowInserting')}
        onRowInserted={() => console.log('RowInserted')}
        onRowUpdating={() => console.log('RowUpdating')}
        onSaving={handleSaving}
        onSaved={() => console.log('Saved')}
        keyExpr="id"
        allowColumnReordering={true}
        showBorders={true}
        showRowLines={true}
        showColumnLines={true}
        rowAlternationEnabled={true}
        rowHeight={50}
        onEditingStart={onEditingStart}
        onEditCanceled={onEditingCancel}
      >
        <Paging enabled={true} />

        <Editing
          mode="popup"
          allowUpdating={true}
          allowAdding={user && user.roles && user.roles.split(',').includes('PPC')}
          allowDeleting={user && user.roles && user.roles.split(',').includes('PPC')}
          useIcons={true}
        >
          <Popup title="Detail" showTitle={true} width={700} height={525} onShowing={onShowing} />
          <Form>
            <Item itemType="group" colCount={2} colSpan={2}>
              <Item dataField="workshop" />
              <Item dataField="customer" />
              <Item dataField="styleNo" />
              <Item dataField="color" />
              <Item dataField="colorName" />
              <Item dataField="materialArrivalDate" />
              <Item dataField="submissionDate" />
              <Item dataField="fcpSubmissionDate" />
              <Item 
                dataField="mcdTracking"    
                editorType={user && user.roles && user.roles.split(',').includes('MCD') ? 'dxSelectBox' : 'dxTextBox'}
                editorOptions={mcdtrackingOptions}
                validationRules={[{ type: 'required', message: 'MCD Tracking is required' }]}
                itemRender={renderMcdTrackingItem}
              />
              <Item 
                dataField="mcdResponse"
                editorType={user && user.roles && user.roles.split(',').includes('MCD') ? 'dxSelectBox' : 'dxTextBox'}
                editorOptions={mcdResponseOptions}
                itemRender={renderMCDResponseItem}
              />
              <Item 
                dataField="mcdNote"
                editorType="dxTextArea"
                colSpan={2}
              />
              <Item 
                dataField="labTracking"
                editorType={user && user.roles && user.roles.split(',').includes('LAB') ? 'dxSelectBox' : 'dxTextBox'}
                editorOptions={labtrackingOptions}
                itemRender={renderLabResponseItem}
              />
              <Item 
                dataField="labResponse"
                editorType={user && user.roles && user.roles.split(',').includes('LAB') ? 'dxSelectBox' : 'dxTextBox'}
                editorOptions={labResponseOptions}
                itemRender={renderLabResponseItem}
              />
              <Item 
                dataField="labNote" 
                editorType="dxTextArea"
                colSpan={2}
              />
              <Item 
                dataField="ppcTypeSelect" 
                editorType={user && user.roles && user.roles.split(',').includes('PPC') ? 'dxSelectBox' : 'dxTextBox'}
                editorOptions={ppcReturnTypeItemsOptions}
              />
              <Item 
                dataField="ppcResponder"
                editorType='dxTextBox'
              />
              <Item 
                dataField="ppcResponse"
                editorType={user && user.roles && user.roles.split(',').includes('PPC') ? 'dxSelectBox' : 'dxTextBox'}
                editorOptions={ppcResponseOptions}
              />
              <Item
                dataField="ppcNote"
                editorType="dxTextArea"
                colSpan={2}
              />
              <Item dataField="ppcPhone" />
              <Item 
                dataField="ppcFinished" 
                editorType='dxCheckBox'
              />
            </Item>
          </Form>
        </Editing>

        <Column dataField="workshop" caption="Workshop" width={120} />
        <Column dataField="customer" caption="Customer" width={120} />
        <Column dataField="styleNo" caption="StyleNo" width={150} />
        <Column dataField="color" caption="Color" width={120} />
        <Column dataField="colorName" caption="Color Name" width={120} />
        <Column dataField="materialArrivalDate" caption="Material Arrival Date" dataType="date" width={180} />
        <Column dataField="submissionDate" caption="Submission Date" dataType="date" width={150} />
        <Column dataField="fcpSubmissionDate" caption="FCP Submission Date" dataType="date" width={180} />
        <Column dataField="mcdTracking" caption="MCD Tracking" width={130} cellRender={renderTracking} />
        <Column dataField="mcdResponse" caption="MCD Response" width={130} />
        <Column dataField="mcdNote" caption="MCD Note" width={130} />
        <Column dataField="mcdColorPalletFile" caption="MCD ColorPalletFile" width={200} cellRender={renderAttachmentButton} />
        <Column dataField="labTracking" caption="LAB Tracking" width={130} cellRender={renderTracking} />
        <Column dataField="labResponse" caption="LAB Response" width={130} cellRender={renderLabResponseCell} />
        <Column dataField="labNote" caption="LAB Note" width={130} />
        <Column dataField="ppcTypeSelect" caption="Return Type" width={120} />
        <Column dataField="ppcResponder" caption="PPC Responder" width={150} />
        <Column dataField="ppcResponse" caption="PPC Response" width={150} />
        <Column dataField="ppcNote" caption="PPC Note" visible={true} width={180} /> 
        <Column dataField="ppcPhone" caption="PPC Phone" width={120} />
        <Column dataField="ppcFinished" caption="Is Finished" width={120} />
        <Column 
          dataField="doclog" 
          caption="Log" 
          width={120} 
          cellRender={(cellData) => (
            <button 
              style={{ borderRadius: '12px', padding: '5px 10px' }} 
              onClick={() => handleGetLog(user.id, cellData.data.id)}
            >
              View
            </button>
          )}
        />
      </DataGrid>

      <LogPopup
        visible={popupVisible}
        onHiding={() => setPopupVisible(false)}
        dragEnabled={true}
        closeOnOutsideClick={true}
        showTitle={true}
        title="Log Details"
        width={1000}
        height={800}
      >
        <div 
          style={{ maxHeight: '900px', overflowY: 'auto' }} 
          dangerouslySetInnerHTML={{ __html: popupContent }} 
        />
      </LogPopup>
    </React.Fragment>
  );
};

export default Dashboard;
