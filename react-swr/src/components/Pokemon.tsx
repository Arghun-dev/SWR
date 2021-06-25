import { Card, Col } from 'antd';
import useFetch from 'hooks/useFetch';
import { PokemonType, IPoke } from 'types/pokemon';

const Pokemon = (pokemon: PokemonType) => {
  const { data, error } = useFetch('pokemon', pokemon.name);

  if (error) {
    console.log('error', error);
    return <div>Something Went Wrong!!</div>
  }

  if (!data) return <div>loading...</div>

  return (
    <Col xs={24} md={12} lg={8}>
      <Card hoverable title={data.name}>
        <span className='Card--id'>{data.id}</span>
          <img
            className='Card--image'
            src={data.sprites.front_default}
            alt={data.name}
          />
          <span className='Card--details'>
            {data.types.map((poke: IPoke) => poke.type.name).join(', ')}
          </span>
      </Card>
    </Col>
  )
}

export default Pokemon;