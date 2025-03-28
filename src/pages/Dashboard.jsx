
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUploader } from '@/components/FileUploader';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRight, FileUp, PanelLeft } from 'lucide-react';

import DataGrid, {
  Column,
  Editing,
  Paging,
  Popup,
  Form,
} from 'devextreme-react/data-grid';

import { Popup as LogPopup } from 'devextreme-react/popup'; 
import { useNavigate, useLocation } from 'react-router-dom';
import 'devextreme-react/text-area';
import { Item } from 'devextreme-react/form';
import { userService } from '../../services/user.service';
import { authenticationService } from '../../services/authentication.service';
import { useDispatch, useSelector } from 'react-redux'; // Add useSelector import
import { logMessages } from '../../helpers/log';
import { FileUploader } from 'devextreme-react/file-uploader';

onst [roleName, setRoleName] = useState('');
  const [role, setRole] = useState('');
  const [dataList, setDataList] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [dataSources, setDataSource] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupContent, setPopupContent] = useState('');
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const [currentRowId, setCurrentRowId] = useState(null);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const subscription = authenticationService.currentUser.subscribe(x => {
      setCurrentUser(x);
     
      setIsAdmin(x && x.role === 'Admin');
      if(x){
      userService.getCpsData(x.id, 'CPS')
        .then(response => {
          setDataSource(response);
          
        });
      }
    });

    return () => {
      if (subscription && typeof subscription.unsubscribe === 'function') {
      subscription.unsubscribe();
      }
    };
  }, []);




  

  const isFieldEditable = (field, department) => {
    const editableFields = {
      RMMCD: ['mcdTracking', 'mcdResponse', 'mcdNote'],
      RMLAB: ['labTracking', 'labResponse', 'labNote'],
      RMPPC: ['workshop', 'customer', 'styleNo', 'BirthDate', 'color', 'materialArrivalDate','ppcResponder', 'ppcResponse', 'ppcNote'],
    };
    return editableFields[department]?.includes(field);
  };


  const unreadItems      = ['Unread'];
  const mcdtrackingItems = ['Waiting Confirm','Confirm receipt', 'Cancel/Other', 'Return']
  const mcdResponseItems = ['Modify text description', 'Modify physical material information', 'Modify text description and physical material information', 'Cancel']
  
  const labtrackingItems  = ['Waiting Confirm','Confirm receipt', 'Return', 'Complete', 'Call back to modify', 'Cancel']
  const labResponseItems  = ['PPC schedule is unreasonable', 'MCD delayed providing the color chart', 'Material delayed to the factory', 'Other']
  
  const ppcReturnTypeItems = ['Standard products' ,'Sample product']
  const ppcResponseItems   = ['Customer cancels order', 'Transfer factory', 'Other']

  const mcdtrackingOptions= { items: mcdtrackingItems };
  const mcdResponseOptions= { items: mcdResponseItems };
  const labtrackingOptions= { items: labtrackingItems };
  const labResponseOptions= { items: labResponseItems };
  const ppcReturnTypeItemsOptions= { items: ppcReturnTypeItems };
  const ppcResponseOptions= { items: ppcResponseItems };

  const status = ['Waiting','Accept', 'Reject', 'Return'];
  const statusOptions = {
    items: status,
  };

const getLog = (userid, cpid) => {
  userService.getLog(userid, cpid)
    .then(response => {
      const logEntries = response.map(log => {
        console.log('Log:', log);
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
    })
    .catch(error => {
      console.error('Error fetching log:', error);
    });
};

  const set_DataSource = () => {
    userService.getCpsData(currentUser.id, 'CPS')
    .then(response => {
      setDataSource(response);
    });
  };

  const showUploadFile = async (fileUrl) => {
    try {
      if (fileUrl) {
        window.open(fileUrl, '_blank');
      } else {
        // alert('No file found for this record.');
      }
    } catch (error) {
      console.error('Error fetching file URL:', error);
      // alert('Error fetching file URL');
    }
  };
    
  const requestReUploadFile = async (userid, cpid) => {

    try {
      userService.requestReUploadFile(userid, cpid)
        .then(response => {
          console.log('Request Re-Upload response:', response);
          // alert('Request Re-Upload successfully!');
          set_DataSource();
        });
    } catch (error) {
      console.error('Error requesting re-upload:', error);
      // alert('Error requesting re-upload');
    }
  };


  const onShowing = () => {
    if (currentRowId) {
      if (currentUser && currentUser.roles.split(',').includes('MCD')) {
        if(dataSources.find(item => item.id === currentRowId).mcdTracking === 'Unread'){
        userService.updateCpsState(currentUser.id, 1,mcdtrackingItems[0], currentRowId).then(response => {
          console.log('CPS State:', response);
        });
      }
      }
      if (currentUser &&  currentUser.roles.split(',').includes('LAB')) {
        if(dataSources.find(item => item.id === currentRowId).labTracking === 'Unread'){
        userService.updateCpsState(currentUser.id, 2, labtrackingItems[0] , currentRowId).then(response => {
        });
      }
      }
      // if (currentUser && currentUser.department === 'RMPPC') {
      //   if(dataSources.find(item => item.id === currentRowId).ppcTracking === 'Unread'){
      //   userService.updateCpsState(currentUser.id, 3, logMessages.ppcTracking, currentRowId).then(response => {
      //     console.log('CPS State:', response);
      //    });
      // }
      // }
    }

    // Additional logic can be added here
  };

  const onEditorPreparing = (e) => {
  e.editorOptions.disabled = true;
  if (e.parentType === 'dataRow' && currentUser &&  currentUser.roles.split(',').includes('PPC')) 
    {
        if (['workshop', 'customer', 'styleNo', 'color', 'colorName', 'materialArrivalDate', 'submissionDate', 'fcpSubmissionDate'].includes(e.dataField)) {
          if (e.row.data.mcdTracking === 'Unread' || e.row.isNewRow) 
            {
            e.editorOptions.disabled = false;
            e.editorElement.style.backgroundColor = 'lightgreen';
          }
        }
    
    if (['ppcResponse','ppcNote','ppcTypeSelect','ppcPhone','ppcFinished'].includes(e.dataField)) {
      if (e.row.data.labTracking !== 'Unread' && e.row.data.labTracking !==null && e.row.data.labTracking !==undefined) {
        e.editorOptions.disabled = false;
        e.editorElement.style.backgroundColor = 'lightgreen';
        e.row.data.ppcResponder=currentUser.id;
      }
    }
  }

  

  if (e.parentType === 'dataRow' && currentUser &&  currentUser.roles.split(',').includes('MCD')) {
    if (['mcdTracking', 'mcdResponse', 'mcdNote'].includes(e.dataField)) {
      console.log(e.row);
      if (e.row.data.labTracking === 'Unread' || e.row.data.labTracking === null || e.row.data.labTracking === 'null') {
        e.editorOptions.disabled = false;
        e.editorElement.style.backgroundColor = 'lightgreen';
      }
    }
  }; 


  
  if (e.parentType === 'dataRow' && currentUser &&  currentUser.roles.split(',').includes('LAB')) {
    if (['labTracking', 'labResponse', 'labNote'].includes(e.dataField)) {
      if ( e.row.data.ppcTypeSelect === null || e.row.data.ppcTypeSelect === 'null') {
        e.editorElement.style.backgroundColor = 'lightgreen';
        e.editorOptions.disabled = false;
     }
    }
  }; 

};

//----------------------------------------

const handleRowRemoving = (e) => {
  // Perform API call or request to delete the data
  console.log('Deleting data:', e.data);
  userService.removeCPS(currentUser.id, e.data.id)
  .then(response => {
    console.log('response', response);
  });
};
//-------------------------------

//Render Tracking

const handleSaving = (e) => {
  console.log('Saving:', e);
  const changes = e.changes;
  changes.forEach(change => {
    if (change.type === 'update') {
      const key= change.key;
      const values = JSON.stringify(change.data);
      
      userService.updateCps(currentUser.id, key, values)
        .then(response => {
          console.log('Update response:', response);
          set_DataSource();
        });
    }

    if (change.type === 'insert') {
      const key= change.key;
      const values = JSON.stringify(change.data);
      
      userService.InsertCps(currentUser.id, key, values)
        .then(response => {
          console.log('response:', response);
          set_DataSource();
        });
    }

  });
};

const renderTracking = (cellData) => {
  const style = {
    backgroundColor: cellData.value === 'Unread' ? 'yellow' : 'transparent',
  };
  return (
    <div style={style}>
      {cellData.value}
    </div>
  );
};

  //-------------------------------

  const renderLabResponseCell = (cellData) => {
    const style = {
      backgroundColor: cellData.value === 'Waiting' ? 'red' : 'transparent',
      color: cellData.value === 'Waiting' ? 'white' : 'black',
    };
    return (
      <div style={style}>
        {cellData.value}
      </div>
    );
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
    const style1 = {
      backgroundColor: itemData.editorOptions.value === 'Unread' ? 'yellow' : 'Green',
      color: itemData.editorOptions.value === 'Unread' ? 'black' : 'black',
    };
    return (
      <div style={style1}>
        <select
          value={itemData.editorOptions.value}
          onChange={(e) => itemData.editorOptions.onValueChanged(handleMcdTrackingChange(e.target.value))}
        >
          {mcdtrackingOptions.dataSource.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  };
//--------------------------------------
  const showFullContentPopup = (content) => {
    setPopupContent(content);
    setPopupVisible(true);
  };

  const onEditingStart = (e) => {
    setCurrentRowId(e.data.id);
  };

  const onEditingCancel = (e) => {
    set_DataSource();
  };
  
  const handleFileUpload = (e, rowData) => {
    const fileInput = e.target.files[0];
    if (fileInput) {
      // You can replace this with your file upload logic
      const formData = new FormData();
      formData.append('file', fileInput);
      formData.append('id', rowData.id);
      formData.append('userid', currentUser.id);
      // Example: Send file to the server for upload
      userService.uploadFile(formData)
        .then(response => {
          set_DataSource();
          console.log('File uploaded successfully:', response);
          alert('File uploaded successfully!');
        })
        .catch(error => {
          console.error('Error uploading file:', error);
          alert('Error uploading file');
        });
    }
  };



  const confirmReUploadFile = async (userid, cpid, confirm) => {
    try {
      const response = await userService.confirmReUploadFile(userid, cpid, confirm);
      console.log('Confirm Re-Upload response:', response);
      alert(confirm ? 'Re-Upload confirmed successfully!' : 'Re-Upload canceled successfully!');
      set_DataSource();
    } catch (error) {
      console.error('Error confirming re-upload:', error);
      alert('Error confirming re-upload');
    }
  };


  const renderAttachmentButton = (cellData) => {
   // console.log('Cell Data:', cellData);
    
    const isFileUploaded = !!cellData.value;
    if (currentUser &&  currentUser.roles.split(',').includes('MCD')) {
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


          {(!isFileUploaded || cellData.data.confirmUploadFile ) && (
        <button 
          onClick={() => document.getElementById(`file-upload-${cellData.data.id}`).click()}
          style={{ borderRadius: '12px', padding: '5px 10px' }}
        >
          Upload Attachment
        </button>
          )}
          {(isFileUploaded && cellData.data.confirmUploadFile==false ) && (
          <div style={{ color: 'orange' }}>
        
           Upload file request was rejected
          </div>
        )}


          {isFileUploaded && (cellData.data.confirmUploadFile === null || cellData.data.confirmUploadFile === false) && (
        <button
          onClick={() => requestReUploadFile(currentUser.id, cellData.key)}
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
    } 

    //----------------------------------------------
    else if (currentUser && currentUser.roles.split(',').includes('MCD-Admin')) {
      return (
      <div>
       
       
       {isFileUploaded && (
          <a
        href={cellData.value}
        download={(() => {
          if (cellData.value) {
        const fileName = cellData.value.split('\\').pop();
        console.log('fileName', fileName);
        return fileName;
          }
        })()}
        style={{ textDecoration: "none", color: "blue", cursor: "pointer" }}
          >
        {cellData.value.split('\\').pop()}
          </a>
        )}
        
        {isFileUploaded && cellData.data.requestUploadFile && cellData.data.requestUploadFile === true &&   cellData.data.confirmUploadFile   ===null && (
        <div>
          <hr />
          <p>Confirm Re-upload File:</p>
          <label>
        <input
          type="radio"
          name={`confirm-reupload-${cellData.key}`}
          value="yes"
          onChange={() => {
        confirmReUploadFile(currentUser.id, cellData.key, true);
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
        confirmReUploadFile(currentUser.id, cellData.key, false);
        cellData.data.requestUploadFile = false;
          }}
        />
        No
          </label>
        </div>
        )}


      </div>
      );
    } 
    

    
    else {
      return (
        isFileUploaded && (
          <a
            href={cellData.value}
            download={(() => {
              if (cellData.value) {
                const fileName = cellData.value.split('\\').pop();
                console.log('fileName', fileName);
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
  



const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();



 
  return (
    <React.Fragment>
    <DataGrid
      id="gridContainer"
      dataSource={dataSources}
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
      rowHeight={50} // Increase row height
      onEditingStart={onEditingStart}
      onEditCanceled={onEditingCancel}
    >

      <Paging enabled={true} />

      <Editing
        mode="popup"
        allowUpdating={true}
        allowAdding={currentUser &&  currentUser.roles.split(',').includes('PPC')}
        allowDeleting={currentUser &&  currentUser.roles.split(',').includes('PPC')}
        useIcons={true}
      >

      <Popup title="Detail" showTitle={true} width={700}
        height={525} onShowing={onShowing} />
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
          <Item dataField="mcdTracking"    
             editorType={currentUser &&  currentUser.roles.split(',').includes('MCD') ? 'dxSelectBox' : 'dxTextBox'}
             editorOptions= {mcdtrackingOptions}
             validationRules={[{ type: 'required', message: 'MCD Tracking is required' }]}
             itemRender={renderMcdTrackingItem}
             />
          <Item dataField="mcdResponse"
           editorType={currentUser &&  currentUser.roles.split(',').includes('MCD') ? 'dxSelectBox' : 'dxTextBox'}
           editorOptions= {mcdResponseOptions}
           itemRender={renderMCDResponseItem}
           />
          <Item dataField="mcdNote"
           editorType="dxTextArea"
           colSpan={2}
          />
          <Item dataField="labTracking"
             editorType={currentUser &&  currentUser.roles.split(',').includes('LAB') ? 'dxSelectBox' : 'dxTextBox'}
             editorOptions= {labtrackingOptions}
             itemRender={renderLabResponseItem}
             />
          <Item dataField="labResponse"
             editorType={currentUser &&  currentUser.roles.split(',').includes('LAB')? 'dxSelectBox' : 'dxTextBox'}
             editorOptions= {labResponseOptions}
             itemRender={renderLabResponseItem}
             />
          <Item dataField="labNote" 
           editorType="dxTextArea"
           colSpan={2}
           />

          <Item dataField="ppcTypeSelect" 
              editorType={currentUser &&  currentUser.roles.split(',').includes('PPC') ? 'dxSelectBox' : 'dxTextBox'}
              editorOptions= {ppcReturnTypeItemsOptions}
          />
           <Item dataField="ppcResponder"
             editorType='dxTextBox'
             />
           <Item dataField="ppcResponse"
             editorType={currentUser &&  currentUser.roles.split(',').includes('PPC') ? 'dxSelectBox' : 'dxTextBox'}
             editorOptions= {ppcResponseOptions}
             />
          <Item
            dataField="ppcNote"
            editorType="dxTextArea"
            colSpan={2}
             />
          <Item dataField="ppcPhone" />
          <Item dataField="ppcFinished" 
           editorType='dxCheckBox'
          />
        </Item>
      </Form>
    </Editing>

      <Column dataField="workshop" caption="Workshop"   width={120} />
      <Column dataField="customer" caption="Customer"  width={120}/>
      <Column dataField="styleNo" caption="StyleNo"  width={150}/>
      <Column dataField="color" caption="Color" width={120} />
      <Column dataField="colorName" caption="Color Name" width={120} />
      <Column dataField="materialArrivalDate" caption="Material Arrival Date" dataType="date" width={180} />
      <Column dataField="submissionDate" caption="Submission Date" dataType="date" width={150} />
      <Column dataField="fcpSubmissionDate" caption="FCP Submission Date" dataType="date" width={180} />
      <Column dataField="mcdTracking" caption="MCD Tracking" width={130}  cellRender= {renderTracking}/>
      <Column dataField="mcdResponse" caption="MCD Response" width={130} />
      <Column dataField="mcdNote" caption="MCD Note" width={130} />
      <Column dataField="mcdColorPalletFile" caption="MCD ColorPalletFile" width={200} cellRender={renderAttachmentButton}/>
      <Column dataField="labTracking" caption="LAB Tracking" width={130} cellRender= {renderTracking}/>
      <Column dataField="labResponse" caption="LAB Response" width={130} cellRender={renderLabResponseCell}/>
      <Column dataField="labNote" caption="LAB Note" width={130} />
      <Column dataField="ppcTypeSelect" caption="Return Type" width={120} />
      <Column dataField="ppcResponder" caption="PPC Responder" width={150}/>
      <Column dataField="ppcResponse" caption="PPC Response" width={150}/>
      <Column dataField="ppcNote" caption="PPC Note" visible={true} width={180}/> 
      <Column dataField="ppcPhone" caption="PPC Phone" width={120} />
      <Column dataField="ppcFinished" caption="Is Finished" width={120} />
      <Column dataField="doclog" caption="Log" width={120} 
        cellRender={(cellData) => <button   style={{ borderRadius: '12px', padding: '5px 10px' }} onClick={() => getLog(currentUser.id, cellData.data.id)}>View</button>}
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
      <div style={{ maxHeight: '900px', overflowY: 'auto' }} dangerouslySetInnerHTML={{ __html: popupContent }} />
    </LogPopup>
    
  </React.Fragment>
  );
};

export default Dashboard;
