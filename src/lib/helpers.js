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
        const res=await fetch(url, {
            ...options,
            cf:{
                cacheEverything:true,
                cacheTtlByStatus:{"200-299": 604800, "404": 60, "500-599": 0}
            }
        }
    );
        return res.ok ? await res.json() : null;
    }catch{
        return null;
    }
}