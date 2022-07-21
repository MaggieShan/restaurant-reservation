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

type Reservation = {
  date: string,
  userid: string,
  duration: number,
  start_time: string,
  end_time: string,
  phone: number,
  special_occasion: boolean,
  visitors: number,
}

export default function Restaurant() {
  const [reservations, updateRes] = useState<Reservation[]>();

  const getReservationsByDate = () => {
    var params = {
        TableName: "reservations",
        IndexName : "date-start_time-index",
        KeyConditionExpression: "#date = :v_date",
        ExpressionAttributeNames:{
            "#date": "date"
        },
        ExpressionAttributeValues: {
            ":v_date": "2022-07-19"
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
  })

  const date = new Date().toDateString();

  return (
    <div>
    <div style={dateStyle}>Date: {date}</div>
    <Accordion allowToggle>
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box flex='1' textAlign='left'>
              Section 1 title
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
            {reservations?.map(element => (
              <Box style={boxStyle} key={element.userid}>
              <Popover>
              <PopoverTrigger>
                <Button>{element.userid}</Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>{element.userid}</PopoverHeader>
                <PopoverBody>
                Name: {element.userid}
                <br/>
                Time: {element.start_time}
                <br/>
                Duration: {element.duration} minutes
                <br/>
                Visitors: {element.visitors}
                <br/>
                Phone: {element.phone}
                </PopoverBody>
              </PopoverContent>
            </Popover>
            </Box>
            ))}
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box flex='1' textAlign='left'>
              Section 2 title
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
          veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo consequat.
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
    </div>
  )
}
