export async function POST(req) {

try {

const body = await req.json();

const googleResponse = await fetch(

process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL,

{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(body),

redirect:"follow"

}

);

if(!googleResponse.ok){

return Response.json(

{

success:false,

error:"Google Script request failed"

},

{

status:500

}

);

}

const text = await googleResponse.text();

let result;

try{

result = JSON.parse(text);

}catch{

return Response.json(

{

success:false,

error:text

},

{

status:500

}

);

}

return Response.json(result);

}

catch(error){

console.log(error);

return Response.json(

{

success:false,

error:String(error)

},

{

status:500

}

);

}

}