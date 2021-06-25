import { Row } from 'antd';
import useFetch from 'hooks/useFetch';
import { PokemonType } from 'types/pokemon';
import Pokemon from 'components/Pokemon';

const Pokedox = () => {
  const { data, error } = useFetch('pokemon');

  if (error) return <h1>Something Went Wrong!</h1>;

  if (!data) return <div>Loading...</div>

  return (
    <Row style={{ padding: 24 }} justify='center'>
      <h1>pokedox</h1>
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        {data.results.map((pokemon: PokemonType) => <Pokemon {...pokemon} />)}
      </Row>
    </Row>
  )
}

export default Pokedox;