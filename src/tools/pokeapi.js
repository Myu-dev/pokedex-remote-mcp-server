import pokemonNames from "../data/pokemon-names.json";
import {z} from "zod";
import {ok, fail, fetchJson} from "../lib/helpers.js";

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
                genera:sp?.genera?.find((g)=>g.language.name==="ja")?.genus,
                types:p.types.map(t=>t.type.name),
                height_m:p.height/10,
                weight_kg:p.weight/10,
                stats:Object.fromEntries(p.stats.map((s)=>[s.stat.name,s.base_stat]))
            });
        }
    )

    server.tool(
        "search_pokemon_by_japanese_name",
        "日本語名(ピカチュウ、フシギダネなど)から英語名または図鑑番号を検索する。部分一致検索。",
        {name: z.string().describe("日本語名(部分一致)")},
        async ({name})=>{
            const key=name.trim().replace(/[\u3041-\u3096]/g, (c)=>String.fromCharCode(c.charCodeAt(0)+0x60));
            const exactMatches=pokemonNames.filter((pokemon)=>pokemon.ja===key);
            const matches=exactMatches.length
                ? exactMatches
                : pokemonNames.filter((pokemon)=>pokemon.ja.includes(key));
            if(!matches.length)return fail(`「${name}」に一致するポケモンは見つかりませんでした。`);

            return ok(matches.map((pokemon)=>({
                id:pokemon.id,
                japaneseName:pokemon.ja,
                englishName:pokemon.en
            })));
        }
    )
}