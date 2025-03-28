

function getCpsData(user_id, token) {
    const requestOptions = {
        headers: { 'Content-Type': 'application/json' }
    };
    return axios.get(`${config.apiUrl}/cp/getajaxcpdata`, {
        params: {
            userid: user_id,
            token: token,
        }
    }, requestOptions)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            return error;
        });

}

function getCpsState(userid, cpid) {
    const requestOptions = {
        headers: { 'Content-Type': 'application/json' }
    };
    return axios.get(`${config.apiUrl}/cp/getCpsState`, {
        params: {
            userid: userid,
            cpid: cpid,
        }
    }, requestOptions)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            return error;
        });

}




function InsertCps(userid, key, values) {
    const requestOptions = {
        headers: { 'Content-Type': 'application/json' }
    };

    return axios.post(`${config.apiUrl}/cp/InsertCps`, null, {
        params: {
            userid: userid,
            key: key,
            values: values

        }
    }, requestOptions)
        .then(response => {
            sendSignalRMessage(userid, "InsertCPS");
            return response.data;
        })
        .catch(error => {
            return error;
        });
}



function updateCps(userid, key, values) {
    const requestOptions = {
        headers: { 'Content-Type': 'application/json' }
    };

    console.log('updateCps', userid, key, values);
    return axios.put(`${config.apiUrl}/cp/UpdateCps`, null, {
        params: {
            userid: userid,
            key: key,
            values: values

        }
    }, requestOptions)
        .then(response => {
            //-----------------------
            return response.data;


        })
        .catch(error => {
            return error;
        });
}


function updateCpsState(userid, stateIndex, state, cpid) {
    const requestOptions = {
        headers: { 'Content-Type': 'application/json' }
    };
    return axios.post(`${config.apiUrl}/cp/UpdateCpsState`, null, {
        params: {
            userid: userid,
            stateIndex: stateIndex,
            state: state,
            cpid: cpid
        }
    }, requestOptions)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            return error;
        });



}


function removeCPS(userid, cpid) {
    const requestOptions = {
        headers: { 'Content-Type': 'application/json' }
    };

    return axios.delete(`${config.apiUrl}/cp/RemoveCPS`, {
        headers: requestOptions.headers,
        params: {
            userid: userid,
            cpid: cpid
        }
    })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            return error;
        });
}

function getLog(userid, cpid) {
    const requestOptions = {
        headers: { 'Content-Type': 'application/json' }
    };
    return axios.get(`${config.apiUrl}/cp/getLog`, {
        params: {
            userid: userid,
            cpid: cpid,
        }
    }, requestOptions)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            return error;
        });
}


function requestReUploadFile(userid, cpid) {
    const requestOptions = {
        headers: { 'Content-Type': 'application/json' }
    };
    return axios.post(`${config.apiUrl}/cp/requestReUploadFileState`, null, {
        params: {
            userid: userid,
            cpid: cpid
        }
    }, requestOptions)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            return error;
        });



}


function confirmReUploadFile(userid, cpid, confirm) {
    const requestOptions = {
        headers: { 'Content-Type': 'application/json' }
    };
    return axios.post(`${config.apiUrl}/cp/confirmUploadFileState`, null, {
        params: {
            userid: userid,
            cpid: cpid,
            confirm: confirm
        }
    }, requestOptions)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            return error;
        });



}

async function uploadFile(file) {

    try {
        const response = await axios.post(`${config.apiUrl}/cp/uploadFile`, file, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        return error;
    }
}