import { Typography } from '@mui/material';
import React from 'react'
import { useDrag } from "react-dnd";
import CloseIcon from '@mui/icons-material/Close';

const Picture = ({character, char_id, itemType, isOnBoard, removeFromBoard}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "div",
    item: { char_id: char_id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div style={{marginRight: 20}} ref={!isOnBoard ? drag : null}>
      <div style={{width: 120, height: itemType==='letter' ? 120 : 70, background: itemType==='letter' ? '#9acd32' : '#bc8f8f', boxShadow: '0 0 10px rgb(0 0 0 / 20%)', cursor: !isOnBoard ? 'move' : 'pointer',  marginTop: (isOnBoard && itemType==='operator') ? 27 : 0}}>
        {
          isOnBoard && 
          <div style={{width: '100%', textAlign: 'right', paddingTop: 5}}>
            <CloseIcon style={{color: 'white', height: 15, cursor: 'pointer'}} onClick={() => {removeFromBoard(char_id)}}/>
          </div>
        }
        <div style={{textAlign: 'center', width: '100%'}}>
          <Typography style={{paddingTop: isOnBoard ? (itemType==='letter' ? 25 : 3) : (itemType==='letter' ? 50 : 25), fontWeight: 'bold'}}>
            {character}
          </Typography>
        </div>
      </div>
    </div>
  )
}

export default Picture