import React from 'react'
import CreateEmployee from './CreateEmployee'
import { useParams } from 'react-router';

function Details() {
    const { id } = useParams();
  return (
    <CreateEmployee id={id} />
  )
}

export default Details