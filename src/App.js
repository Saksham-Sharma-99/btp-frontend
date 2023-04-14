import logo from './logo.svg';
import './App.css';
import { useState,useEffect } from 'react';
import axios from 'axios';
import { Autocomplete, Button, Modal, TextField, Box, Typography } from '@mui/material';

function makeGetRequest(route){
 return axios.get(`http://localhost:8000/${route}`)
}

function App() {
  const [alloys,setAlloys] = useState([])
  const [alloy,setAlloy] = useState()
  const [params, setParams] = useState([])
  const [param, setParam] = useState()

  const [result,setResult] = useState('')
  const [showModal,setShowModal] = useState(false)
  const [error, setError] = useState(false)

  const [resultModal,setShowResult] = useState(false)

  useEffect(()=>{
    makeGetRequest("alloys").then((res)=>{
      setAlloys(res.data.data)
    })
    makeGetRequest("params").then((res)=>{
      setParams(res.data.data)
    })
  },[])


  const callResults = () =>{

    if (alloy== null){
      setResult("select alloy first")
      setShowResult(true)
      setError(true)
      return
    }else if (param == null){
      setResult("select condition it was treated with first")
      setShowResult(true)
      setError(true)
      return
    }


    let route = "strength_data"
    axios.get(`http://localhost:8000/${route}?alloy=${alloy}&condition=${param}`).then((res)=>{
      setError(false)
      setResult(res.data.data)
    }).catch((error)=>{
      setResult(error)
      setShowResult(true)
    }
      ).finally(()=>setShowResult(true))
  }


  return (
    <div className="App">
      <header className="App-header">
        <h1>Fatigue Strength Calculator</h1>
        <img src={logo} className="App-logo" alt="logo" />
        <div style={{display:"flex", padding:"10px", justifyContent:"space-between", width:"55vw"}}>
          <div style={{backgroundColor:"white",padding:"5px", borderRadius:"10px"}}>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={alloys}
                sx={{ width: 300}}
                renderInput={(alloys) => <TextField {...alloys} label="Alloy" />}
                onChange={(event, newValue) => {
                  setAlloy(newValue);
                }}
                />
            </div>
            <div style={{backgroundColor:"white",padding:"5px", borderRadius:"10px"}}>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={params}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Condition" />}
                onChange={(event, newValue) => {
                  setParam(newValue);
                }}
                />
            </div>
          <Button variant="contained" onClick={callResults}>
            Get Results
          </Button>
          
        </div>
        <div style={{display:"flex",flexWrap: "wrap"}}>
           <Button style={{fontSize:"0.5em"}} onClick={()=>setShowModal(true)}>can't find your alloy?</Button>
        </div>
        <Modal
          open={resultModal}
          onClose={()=>setShowResult(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <div>
          <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                p: 4,
              }}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
            {!error? `Results for condition ${param}` : "Error"}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              {!error? `Fatigue Strength = ${result}` : result}
            </Typography>
            </Box>
          </div>

        </Modal>
        
        <Modal
          open={showModal}
          onClose={()=>setShowModal(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <div style={{justifyContent:"space-between", textAlign:"center"}}>
          <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                p: 4,
              }}>
                <div>
                <TextField label="Alloy" />
                <TextField label="VEC" />
                <TextField label="E/A" />
                <TextField label="Mixing Enthalpy" />
                <TextField label="Atomic Radius Diff" />
                <TextField label="EWF" />
                <TextField label="DeltaG" />
                <TextField label="ShearModG" />
                <TextField label="Electronegativity Difference" />
                <TextField label="Condition" />
                </div>
                
                <div style={{margin:"20px"}}>
                  <Button variant="contained" onClick={callResults}>
                    Request Results
                  </Button>
                </div>
            </Box>
          </div>

        </Modal>


      </header>
    </div>
  );
}

export default App;
