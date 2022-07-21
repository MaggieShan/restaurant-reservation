import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  Button
} from '@chakra-ui/react'
import * as AWS from 'aws-sdk'

const docClient = new AWS.DynamoDB.DocumentClient()

const boxStyle = {
  display: 'inline-block',
  padding: '3px',
}

const dateStyle = {
  padding: '10px',
  font: '30px',
}

export type Reservation = {
  name: string,
  date: string,
  userid: string,
  duration: number,
  start_time: string,
  end_time: string,
  phone: string,
  special_occasion: boolean,
  visitors: number,
}

export default function Restaurant() {
  const [reservations, updateRes] = useState<Reservation[]>();
  const times = ["08:00:00", "09:00:00", "10:00:00", "11:00:00", "12:00:00", "13:00:00", "14:00:00", "15:00:00", "16:00:00", "17:00:00", "18:00:00", "19:00:00", "20:00:00"];

  const getReservationsByDate = () => {
    var params = {
        TableName: "reservations",
        IndexName : "date-start_time-index",
        KeyConditionExpression: "#date = :v_date",
        ExpressionAttributeNames:{
            "#date": "date"
        },
        ExpressionAttributeValues: {
            ":v_date": "2022-07-21"
        }
    } 
  
    docClient.query(params, function(err, data) {
        if (err) {
            console.error("Could not get reservations");
        } else {
            console.log("Reservations retrieved");
            var string_output = JSON.stringify(data);
            var object_output = JSON.parse(string_output);
            var res_list = object_output.Items? object_output.Items: [];
            var new_list: Reservation[] = []
            for(var i = 0; i < res_list.length; i++){
              var res_obj = {
                date: object_output.Items[i].date,
                name: object_output.Items[i].name,
                userid: object_output.Items[i].userid,
                duration: object_output.Items[i].duration,
                start_time: object_output.Items[i].start_time,
                end_time: object_output.Items[i].end_time,
                phone: object_output.Items[i].phone,
                special_occasion: object_output.Items[i].special_occasion,
                visitors: object_output.Items[i].visitors,
              }
              new_list.push(res_obj)
            }
            updateRes(new_list);
        }
    });
  }

  useEffect(() => {
    getReservationsByDate()
  }, [])

  const date = new Date().toDateString();

  return (
    <div>
    <div style={dateStyle}>Date: {date}</div>
    <Accordion allowToggle>
    {times?.map(time => (
      <AccordionItem key={time}>
        <h2>
          <AccordionButton>
            <Box flex='1' textAlign='left'>
              {time}
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          {reservations?.map(element => {
            if (element.start_time === time) { 
            return (
              <Box style={boxStyle} key={element.userid}>
              <Popover>
              <PopoverTrigger>
                <Button>{element.name}</Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>{element.userid}</PopoverHeader>
                <PopoverBody>
                Email: {element.userid}
                <br/>
                Time: {element.start_time} - {element.end_time}
                <br/>
                Duration: {element.duration} hr(s)
                <br/>
                Visitors: {element.visitors}
                <br/>
                Phone: {element.phone}
                </PopoverBody>
              </PopoverContent>
            </Popover>
            </Box>
          )}}
          )}
        </AccordionPanel>
      </AccordionItem>
    ))}
    </Accordion>
    </div>
  )
}
