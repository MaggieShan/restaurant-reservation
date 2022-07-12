import React, { useEffect } from "react";
import { fetchData } from "../lib/AwsFunctions.js";

export default function User() {
  const getData = () => {
    fetchData('reservations')
  }

  useEffect(() => {
    getData()
  })

  return (
    <div>Hi user</div>
  )
}
