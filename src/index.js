import { McpAgent } from "agents/mcp";
import {McpServer} from "@modulecontextprotocol/sdk/server/mcp.js";
import {registerTools} from "./tools/index.js"

export class MyMCP extends McpAgent{
	server=new McpServer({name:"Pokedex", version:"0.0.0"});

	async init(){
		registerTools(this.server);
	}
}

export default{
	fetch(request,env,ctx){
		const url=new URL(request.url);
		if(url.pathname==="/see"||url.pathname==="/see/message"){
			return MyMCP.serveSSE("/see").fetch(request,env,ctx);
		}
		if(url.pathname==="/mcp"){
			return MyMCP.serve("/mcp").fetch(request,env,ctx);
		}
		return new Response("Not found", {status:404});
	}
}