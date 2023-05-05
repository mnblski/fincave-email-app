const { openaiInstance } = require("../init");

const instructions = {
    'email_purchase_data': 'Based on this email, extract the following purchase data: store name, purchase date, total cost, cost breakdown, items. Return response in JSON format',
}
    

async function extractPurchaseDataAI(textFromEmail) {

    // console.log('t', textFromEmail);

    try {
        const response = await openaiInstance.createCompletion({
            model: 'text-davinci-003',
            prompt: `Based on this email, extract the following purchase data: Store Name, Date, Total, Items Purchased. Return response in JSON format: ${textFromEmail}`,
            max_tokens: 2000,
            temperature: 0.5
           })
          
          console.log('IS THIS RESULT???:', response.data.choices[0].text);

          return response;

    } catch (err) {
        console.log('open ai error', err.message);
    }
}

module.exports = { extractPurchaseDataAI };