import React, { useEffect, useState } from "react";
import { fetchData } from "../lib/AwsFunctions.js";
import { Reservation } from "./Restaurant";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Switch,
  useToast,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import DatePicker, { CalendarContainer } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import * as AWS from 'aws-sdk';
import styled from '@emotion/styled';

const StyledDatePicker = styled(DatePicker)`
  margin: 10px 0;
  padding: 10px;
  border-radius: 5px;
  background-color: #EDF2F7;
  cursor: pointer;
`;

const StyledBox = styled(Box)`
  padding: 10px;
  margin: 10px 0;
`;

export default function User() {
  const [adding, setAdding] = useState(false);
  const [checking, setChecking] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [duration, setDuration] = useState(1);
  const [phone, setPhone] = useState("");
  const [visitors, setVisitors] = useState(1);
  const [special, setSpecial] = useState("no");
  const [reservation, updateRes] = useState<Reservation>();
  const [submitted, setSubmitted] = useState(false);

  const docClient = new AWS.DynamoDB.DocumentClient()
  const toast = useToast();

  const parse = (val: string) => Number(val.replace(/^\$/, ''));

  // Add reservation
  const addReservation = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
        toast({
          title: 'Error',
          description: "Failed to add reservation",
          status: 'error',
          duration: 9000,
          isClosable: true,
        });  
        console.log('Error', err)
      } else {
        toast({
          title: 'Success',
          description: "Reservation added",
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
        console.log('Success', data)
        setSubmitted(true);
      }
    })
  }

  // Calculate end time
  useEffect(() => {
    const end = new Date();
    end.setTime(startDate.getTime() + duration * 60 * 60 * 1000);
    setEndDate(end);
  }, [startDate, duration])

  // Component to add a new reservation
  const AddReservation = () => (
    <>
      {!submitted && 
      <form onSubmit={addReservation}>
        <StyledBox>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='John Doe' 
            />
          </FormControl>
        </StyledBox>
        <StyledBox>
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='name@email.com' 
            />
          </FormControl>
        </StyledBox>
        <StyledBox>
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
        </StyledBox>
        <StyledBox>
          <StyledDatePicker 
            selected={startDate}
            onChange={(date: Date) => date ? setStartDate(date) : null}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={60}
            timeCaption="Time"
            dateFormat="MMMM d, yyyy h:mm aa"
            calendarContainer={CalendarContainer}
          />
        </StyledBox>
        <StyledBox>
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
        </StyledBox>
        <StyledBox>
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
        </StyledBox>
        <StyledBox>
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
        </StyledBox>
        <Button backgroundColor="#cd4346ff" color="white" type="submit">Reserve</Button>
      </form>
    }
    {submitted && <StyledBox> Reservation created, have a nice day! </StyledBox>}
    </>
  );

  // Check if a reservation exists
  const getReservationsByEmail = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    var params = {
        TableName: "reservations",
        KeyConditionExpression: "#userid = :v_userid",
        ExpressionAttributeNames:{
            "#userid": "userid"
        },
        ExpressionAttributeValues: {
            ":v_userid": email,
        }
    } 
  
    docClient.query(params, function(err, data) {
        if (err) {
            console.error("Could not get reservations");
        } else {
            console.log("Reservations retrieved");
            var string_output = JSON.stringify(data);
            var object_output = JSON.parse(string_output);
            var res_list = object_output.Items ? object_output.Items: [];
            if (res_list.length > 0) {
              var res_obj = {
                date: object_output.Items[0].date,
                name: object_output.Items[0].name,
                userid: object_output.Items[0].userid,
                duration: object_output.Items[0].duration,
                start_time: object_output.Items[0].start_time,
                end_time: object_output.Items[0].end_time,
                phone: object_output.Items[0].phone,
                special_occasion: object_output.Items[0].special_occasion,
                visitors: object_output.Items[0].visitors,
              }
              updateRes(res_obj);
            }
        }
    });
  }

  const CheckReservation = () => {
    return (
      <>
        <form onSubmit={getReservationsByEmail}>
            <StyledBox>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='name@email.com' 
                />
              </FormControl>
            </StyledBox>
            <Button backgroundColor="#cd4346ff" color="white" type="submit">Check Reservation</Button>
          </form>
        
        {reservation &&
          <StyledBox>
            <h2>Reservation for: {reservation.name}</h2>
            <p>Date: {reservation.date}</p>
            <p>Time: {reservation.start_time} to {reservation.end_time}</p>
            <p>Table for: {reservation.visitors} guests </p>
          </StyledBox>
        }
      </>
    );
  }

  return (
    <>
      <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
          What would you like to do today?
        </MenuButton>
        <MenuList>
          <MenuItem onClick={() => {setAdding(!adding); setChecking(false); setSubmitted(false)}}>Reserve a table</MenuItem>
          <MenuItem onClick={() => {setChecking(!checking); setAdding(false); setSubmitted(false)}}>Check reservation</MenuItem>
        </MenuList>
      </Menu>
      {adding && <AddReservation />}
      {checking && <CheckReservation />}
    </>
  );
}
