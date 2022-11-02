import React, { useState } from 'react'
import { LetterList, OperatorList } from '../utils/ItemLists'
import Picture from './Picture'
import { useDrop } from "react-dnd";
import { Button, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const DragDrop = () => {
  const [board, setBoard] = useState([]);
  const [rhsInput, setRHSInput] = useState('');
  const [comparator, setComparator] = useState('');

  const handleEvaluate = async() => {
    let expString = '';
    for(let i=0;i<board.length;i++)
      expString+=board[i].character;
    expString+=comparator;
    expString+=rhsInput;

    console.log(expString);

    try {
      const res = axios.post('https://react-dnd-serverr1.herokuapp.com/api/evaluation/evaluatestring', {
        expstring: expString
      }).then(res => {
        console.log(res.data);
        if(!res.data.isStringValid)
          alert('This is not a valid equation');
        else
        alert(res.data.result);
      }).catch(err => {
        alert('Some error occured, please check your network connection!');
        console.log(err);
      })
    } catch(error) {
      alert('Some error occured, please check your network connection!');
      console.log(error);
    }
  }
  const addImageToBoard = (char_id) => {
    const charList = LetterList.concat(OperatorList).filter((character) => char_id === character.char_id);
    setBoard((board) => [...board, charList[0]]);
  }
  const removeFromBoard = (char_id) => {
    const charList = board.filter((char) => char_id !== char.char_id);
    setBoard(charList);
  }
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "div",
    drop: (item) => addImageToBoard(item.char_id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const takeRHSInput = () => {
    let rhsInp = prompt('What should be the RHS integer?');
    setRHSInput(rhsInp);

  }

  return (
    <div style={{padding: 10, marginRight: 10}}>
      <div style={{marginBottom: 30, overflowX: 'scroll', display: 'flex', paddingBottom: 10}}>
        {
          LetterList.map((letter) => {
            return(
              <Picture 
                key={letter.char_id} 
                character={letter.character} 
                char_id={letter.char_id}
                itemType={letter.charType}
                isOnBoard={false}
                removeFromBoard={removeFromBoard}
              />
            )
          })
        }
      </div>
      <div style={{marginBottom: 30,  overflowX: 'scroll', display: 'flex', paddingBottom: 10}}>
        {
          OperatorList.map((operator) => {
            return(
              <Picture 
                key={operator.char_id}
                character={operator.character} 
                char_id={operator.char_id}
                itemType={operator.charType}
                isOnBoard={false}
                removeFromBoard={removeFromBoard}
              />
            )
          })
        }
        <div style={{display: 'flex', marginLeft: 30}}>
          <div onClick={() => {setComparator('<')}} style={{cursor: 'pointer', width: 120, height: 70, background: '#bc8f8f', textAlign: 'center', boxShadow: '0 0 10px rgb(0 0 0 / 20%)'}}>
            <Typography style={{paddingTop: 25, fontWeight: 'bold'}}>
              {'<'}
            </Typography>
          </div>
          <div onClick={() => {setComparator('>')}} style={{marginLeft: 20, cursor: 'pointer', width: 120, height: 70, background: '#bc8f8f', textAlign: 'center', boxShadow: '0 0 10px rgb(0 0 0 / 20%)'}}>
            <Typography style={{paddingTop: 25, fontWeight: 'bold'}}>
              {'>'}
            </Typography>
          </div>
        </div>
        <div style={{marginLeft: 50}}>
          <div onClick={takeRHSInput} style={{cursor: 'pointer', width: 120, height: 70, background: '#bc8f8f', textAlign: 'center', boxShadow: '0 0 10px rgb(0 0 0 / 20%)'}}>
            <Typography style={{paddingTop: 25, fontWeight: 'bold'}}>
              RHS Integer
            </Typography>
          </div>
        </div>
      </div>


      <div ref={drop} style={{border: '4px dashed rgb(129,129,128)', display: 'flex', width: '100%', paddingTop: 10, paddingLeft: 10, paddingBottom: 10, height: 140, overflowX: 'scroll'}}>
        
        {
          board.map((char) => {
            return(
              <Picture 
                character={char.character} 
                char_id={char.char_id}
                itemType={char.charType}
                isOnBoard={true}
                removeFromBoard={removeFromBoard}
              />
            )
          })
        }
        {
          comparator!=='' &&
          <div style={{width: 120, height: 70, background: '#bc8f8f', boxShadow: '0 0 10px rgb(0 0 0 / 20%)', cursor: 'pointer',  marginTop: 27, marginRight: 20}}>
            
            <div style={{width: '100%', textAlign: 'right', paddingTop: 5}}>
              <CloseIcon style={{color: 'white', height: 15, cursor: 'pointer'}} onClick={() => {setComparator('')}}/>
            </div>
            <div style={{textAlign: 'center', width: '100%'}}>
              <Typography style={{paddingTop: 3, fontWeight: 'bold'}}>
                {comparator}
              </Typography>
            </div>
          </div>
        }
        {
          rhsInput !== '' &&
          <div style={{width: 120, height: 120, background: '#e9967a', boxShadow: '0 0 10px rgb(0 0 0 / 20%)', cursor: 'move'}}>
            <div style={{width: '100%', textAlign: 'right', paddingTop: 5}}>
              <CloseIcon style={{color: 'white', height: 15, cursor: 'pointer'}} onClick={() => {setRHSInput('')}}/>
            </div>
            <div style={{textAlign: 'center', width: '100%'}}>
              <Typography style={{paddingTop: 25, fontWeight: 'bold'}}>
                {rhsInput}
              </Typography>
            </div>
          </div>
        }

      </div>
      
      
      <div>
        <Button variant='contained'  onClick={handleEvaluate} style={{background: '#6495ed', textTransform: 'none', borderRadius: 10, width: '100%', marginTop: 20, boxShadow: 'none'}}>
          <Typography>
            Evaluate
          </Typography>
        </Button>
      </div>
    </div>
  )
}

export default DragDrop