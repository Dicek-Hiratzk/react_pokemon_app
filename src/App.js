import { useEffect, useState } from "react";
import "./App.css";
import { getAllPokemon, getPokemon } from "./utils/pokemon.js";
import Card from "./components/Card/Card.js";
import Navbar from "./components/Navbar/Navbar.js";

function App() {
  const initialURL ="https://pokeapi.co/api/v2/pokemon";
  // ロード中の文言設定用State
  const [loading, setLoading] = useState(true);
  const [pokemonData, setPokemonData] = useState([]);
  const [nextURL, setNextURL] = useState("");
  const [prevURL, setPrevURL] = useState("");

  // 副作用フック（APIなので）
  useEffect(() => {
    const fetchPokemonData = async () => {
      // 全てのポケモンデータを取得
      let res = await getAllPokemon(initialURL);
      // 各ポケモンの詳細なデータを取得
      loadPokemon(res.results);
      setNextURL(res.next);
      setPrevURL(res.previous);
      setLoading(false);
    };
    fetchPokemonData();
  }, []);
  
  // Promise.all 配列を入れるからmap関数 20種類のポケモンデータの取得が終わるまで
  const loadPokemon = async (data) => {
    let _pokemonData = await Promise.all(
      data.map((pokemon) => {
        let pokemonRecord = getPokemon(pokemon.url);
        return pokemonRecord;
      })
    );
    setPokemonData(_pokemonData);
  };

  // 最初へ戻るボタンのロジック
  const handleStartPage = async () => {
    setLoading(true);
    // 最初のページのURLを持ってくる
    let data = await getAllPokemon(initialURL);
    await loadPokemon(data.results);
    setLoading(false);
  };

  // 次へボタンのロジック
  const handleNextPage = async () => {
    setLoading(true);
    // 次のページのURLを持ってくる
    let data = await getAllPokemon(nextURL);
    await loadPokemon(data.results);
    // 3ページ以降のページもいけるようにする
    setNextURL(data.next);
    // 前のページに戻れるように
    setPrevURL(data.previous);
    setLoading(false);
  };

  // 前へボタンのロジック
  const handlePrevPage = async () => {
    if(!prevURL) return;
    setLoading(true);
    let data = await getAllPokemon(prevURL);
    await loadPokemon(data.results);
    setNextURL(data.next); // 次のページへ
    setPrevURL(data.previous); // 前のページへ
    setLoading(false);
  };

  return (
    <>
      <div className="App">
        {loading ? (
          <h1>Now Loading・・・</h1>
        ) : 
        <>
          <Navbar />
          <div className="pokemonCardContainer">
            {pokemonData.map((pokemon, i) => {
              return <Card key={i} pokemon={pokemon} />;
            })}
          </div>
          <div className="btn">
            <button onClick={handleStartPage}>Top</button>
            <button onClick={handlePrevPage}>Prev</button>
            <button onClick={handleNextPage}>Next</button>
          </div>
        </>
        }
      </div>
    </>
  );

};

export default App;
