const { openaiInstance } = require("../init");

const instructions = {
    'email_purchase_data': 'Based on provided text, can you list all purchased product with their prices, total cost breakdown, seller information like name and website as well as date of purchase. Also, return the response in json format.'
}

async function extractPurchaseDataAI(textFromEmail) {
    try {
        const response = await openaiInstance.createCompletion({
            model: 'text-davinci-003',
            prompt: `Please extract and return in JSON all purcha:
                     ${textFromEmail}`,
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