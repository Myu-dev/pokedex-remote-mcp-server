export const ok=(data)=>({
    content:[
        {
            type:"text",
            text: typeof data==="string"? data : JSON.stringify(data,null,2)
        }
    ]
});

export const fail=(message)=>({
    content:[{type:"text",text:message}],
    isError:true
});

export async function  fetchJson(url,options){
    try{
        const res=await fetch(url,options);
        return res.ok ? await res.json() : null;
    }catch{
        return null;
    }
}