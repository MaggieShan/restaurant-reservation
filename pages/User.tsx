import React, { useEffect, useState } from "react";
import { fetchData } from "../lib/AwsFunctions.js";
import { Reservation } from "./Restaurant";
import {
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Switch,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react'
import DatePicker, { CalendarContainer } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import * as AWS from 'aws-sdk'



export default function User() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [duration, setDuration] = useState(1);
  const [phone, setPhone] = useState("");
  const [visitors, setVisitors] = useState(1);
  const [special, setSpecial] = useState("no");
  const [reservations, updateRes] = useState<Reservation[]>();
  
  const moment = require('moment');
  const docClient = new AWS.DynamoDB.DocumentClient()

  const parse = (val: string) => Number(val.replace(/^\$/, ''));

  const addReservation = () => {
    const newReservation: Reservation = {
      name: name,
      userid: email,
      start_time: moment(startDate).format("HH:mm:ss"),
      end_time: moment(endDate).format("HH:mm:ss"),
      duration: duration,
      date: moment(startDate).format("YYYY-MM-DD"),
      phone: phone,
      visitors: visitors,
      special_occasion: special === "yes" ? true : false,
    }

    const params = {
      TableName: "reservations",
      Item: newReservation
    }

    docClient.put(params, function (err, data) {
      if (err) {
          console.log('Error', err)
      } else {
          console.log('Success', data)
      }
    })
  }


  // Calculate end time
  useEffect(() => {
    const end = new Date();
    end.setTime(startDate.getTime() + duration * 60 * 60 * 1000);
    setEndDate(end);
  }, [startDate, duration])

  return (
   <>
   <form onSubmit={addReservation}>
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input 
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder='John Doe' 
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Email</FormLabel>
        <Input 
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='name@email.com' 
        />
      </FormControl>
      <FormControl>
        <FormLabel>Phone</FormLabel>
        <Input 
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="123-456-7890"
          pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
        />
      </FormControl>
      <DatePicker 
        selected={startDate}
        onChange={(date) => date ? setStartDate(date) : null}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={60}
        timeCaption="Time"
        dateFormat="MMMM d, yyyy h:mm aa"
        calendarContainer={CalendarContainer}
      />
      <FormControl>
        <FormLabel>Duration (hr)</FormLabel>
        <NumberInput 
          value={duration}
          onChange={(e) => setDuration(parse(e))}
          defaultValue={1} 
          min={1} 
          max={4}>
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      </FormControl>
      <FormControl>
        <FormLabel>Table size</FormLabel>
        <NumberInput 
          value={visitors}
          onChange={(e) => setVisitors(parse(e))}
          defaultValue={1}
          min={1} 
          max={20}>
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      </FormControl>
      <FormControl display='flex' alignItems='center'>
        <FormLabel>
          Special occasion?
        </FormLabel>
        <Switch 
          id='special' 
          value={special}
          onChange={(e) => setSpecial(e.target.checked ? "yes" : "no")}
        />
      </FormControl>
      <Button type="submit">Reserve</Button>
    </form>
   </>
  )
}
