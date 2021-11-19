'use strict';

const AWS = require("aws-sdk");
const SCHEMA = require("./json-schema");

module.exports = {
  create: async (event, context) => {
    let bodyObj = {};

    try {
      bodyObj = JSON.parse(event.body);
    } catch (error) {
      console.log("There was an error parsing the body ", error);
      return {
        statusCode: 400
      }
    }

    const validation = SCHEMA.CREATE_USER.validate(bodyObj);

    if(validation.error) {
      console.log(validation.error);
      return {
        statusCode: 400
      }
    }

    let putParams = {
      TableName: process.env.DYNAMODB_DEMO_TABLE,
      Item: {
        id: new Date().getTime(),
        name: bodyObj.name,
        age: bodyObj.age,
        address: bodyObj.address,
        email: bodyObj.email
      }
    };

    let putResult = {};

    try {
      let dynamodb = new AWS.DynamoDB.DocumentClient();
      putResult = await dynamodb.put(putParams).promise();
    } catch (putError) {
      console.log('There was an error putting the demo object', putError);
      console.log('Object', putResult);

      return {
        statusCode: 500
      }
    };

    return {
      statusCode: 201
    }
  },
  list: async (event, context) => {
    let scanParams = {
      TableName: process.env.DYNAMODB_DEMO_TABLE
    }

    let scanResult = {}

    try {
      let dynamodb = new AWS.DynamoDB.DocumentClient();

      scanResult = await dynamodb.scan(scanParams).promise();
    } catch (scanError) {
      console.log('There was an error scanning the demo object', scanError);
      console.log('Object', scanResult);

      return {
        statusCode: 500
      }
    }

    if(!scanResult || !Array.isArray(scanResult) || scanResult.Items.length === 0) {
      return {
        statusCode: 500
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify(scanResult.Items.map(user => {
        return {
          id: user.id,
          name: user.name,
          age: user.age,
          address: user.address,
          email: user.email
        }
      }))
    }
  },
  get: async (event, context) => {
    let getParams = {
      TableName: process.env.DYNAMODB_DEMO_TABLE,
      key: {
        id: event.pathParameters.id
      }
    };

    let getResult = {}

    try {
      let dynamodb = new AWS.DynamoDB.DocumentClient();

      getResult = await dynamodb.get(getParams).promise();
    } catch (getError) {
      console.log('There was an error getting the demo user object', scanError);
      console.log('User Object', getResult);

      return {
        statusCode: 500
      }
    }

    if(!getResult.Items) {
      return {
        statusCode: 404
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        id: getResult.Item.id,
        name: getResult.Item.name,
        age: getResult.Item.age,
        address: getResult.Item.address,
        email: getResult.Item.email
      })
    };
  },
  update: async (event, context) => {
    let bodyObj = {}

    try {
      bodyObj = JSON.parse(event.body)
    } catch (jsonError) {
      console.log('There was an error parsing the body', jsonError);
      return {
        statusCode: 400
      }
    }

    let updateParams = {
      TableName: process.env.DYNAMODB_DEMO_TABLE,
      key: {
        id: event.pathParameters.id
      },
      UpdateExpression: 'set #name= :name',
      ExpressionAttributeName: {
        "#name": "name"
      },
      ExpressionAttributeValues: {
        ":name": bodyObj.name
      }
    };

    try {
      let dynamodb = new AWS.DynamoDB.DocumentClient();

      await dynamodb.update(updateParams).promise();
    } catch (updateError) {
      console.log('There was an error updating the demo User object', scanError);
      console.log('User Object', updateResult);

      return {
        statusCode: 500
      }
    }

    return {
      statusCode: 200
    }
  },
  delete: async (event, context) => {
    let deleteParams = {
      TableName: process.env.DYNAMODB_DEMO_TABLE,
      key: {
        id: event.pathParameters.id
      }
    };

    try {
      let dynamodb = new AWS.DynamoDB.DocumentClient();

      await dynamodb.delete(deleteParams).promise();
    } catch (deleteError) {
      console.log('There was an error deleting the demo user object', scanError);

      return {
        statusCode: 500
      }
    }

    return {
      statusCode: 200
    }
  },
};
