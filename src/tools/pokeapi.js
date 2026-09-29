import {z} from "zod";
import {ok, fail, fetchJson} from "./lib/helpers.js";

const API="https://pokeapi.co/api/v2";

export function registerPokeAPI(server){
    server.tool(
        "get_pokemon",
        "ポケモンの情報を取得する。nameは英語名(pikachu)または図鑑番号(25)",
        {name: z.string().describe("英語名または図鑑番号")},
        async ({name})=>{
            const key=name.toLowerCase().trim();
            const [p,sp]=await Promise.all([
                fetchJson(`${API}/pokemon/${key}`),
                fetchJson(`${API}/pokemon-species/${key}`)
            ]);
            if(!p)return fail(`「${name}」は見つかりませんでした。`);

            return ok({
                id:p.id,
                name:p.name,
                japaneseName:sp?.names?.find((n)=>n.language.name==="ja")?.name,
                types:p.types.map(t=>t.type.name),
                height_m:p.height/10,
                weight_kg:p.weight/10,
                stats:Object.fromEntries(p.stats.map((s)=>[s.stat.name,s.base_stat]))
            });
        }
    )
}