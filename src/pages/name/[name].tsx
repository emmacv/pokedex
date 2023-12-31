import Image from "next/image";
import axios_instance from "core/api";
import MainLayout from "core/components/layout/main-layout";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { Card, Grid, Text, Button, Container } from "@nextui-org/react";

import confetti from "canvas-confetti";
import toggleLocalStorage, {
  existsInLocalStorage,
} from "core/utils/toggle-local-storage";
import { useEffect, useState } from "react";

type PokemonProps = {
  id: number | string;
  name: string;
} & {
  pokemon: Pokemon;
};

const PokemonByName: NextPage<PokemonProps> = ({ pokemon }) => {
  const [isInFavorite, setIsInFavorite] = useState(false);

  const handleOnClick = () => {
    toggleLocalStorage(pokemon.id);
    setIsInFavorite(!isInFavorite);

    if (isInFavorite) return;

    confetti({
      zIndex: 8000,
      particleCount: 100,
      startVelocity: 30,
      spread: 160,
      angle: -160,
      origin: {
        x: 1,
        y: 0,
      },
    });
  };

  useEffect(() => {
    setIsInFavorite(existsInLocalStorage(pokemon.id));
  }, [pokemon.id]);

  return (
    <MainLayout title={pokemon.name}>
      <Grid.Container
        css={{
          marginTop: "5px",
          gap: 10,
        }}
      >
        <Grid xs={12} sm={3}>
          <Card
            isHoverable
            css={{
              padding: "30px",
            }}
          >
            <Card.Body>
              <Card.Image
                // @ts-ignore
                src={pokemon.sprites.other?.dream_world.front_default}
                alt={pokemon.name}
                width="100%"
                height={200}
              />
            </Card.Body>
          </Card>
        </Grid>
        <Grid xs={12} sm={8}>
          <Card>
            <Card.Header
              css={{ display: "flex", justifyContent: "space-between" }}
            >
              <Text h1>{pokemon.name}</Text>
              <Button
                color="gradient"
                ghost={!isInFavorite}
                onPress={handleOnClick}
              >
                {`${isInFavorite ? "Guardado" : "Guardar en favoritos"}`}
              </Button>
            </Card.Header>
            <Card.Body>
              <Text size={30}>Sprites: </Text>
              <Container direction="row" display="flex" gap={0}>
                <Image
                  // @ts-ignore
                  src={pokemon.sprites.front_default}
                  alt={pokemon.name}
                  width={100}
                  height={100}
                />
                <Image
                  // @ts-ignore

                  src={pokemon.sprites.front_shiny}
                  alt={pokemon.name}
                  width={100}
                  height={100}
                />
                <Image
                  // @ts-ignore

                  src={pokemon.sprites.back_shiny}
                  alt={pokemon.name}
                  width={100}
                  height={100}
                />
              </Container>
            </Card.Body>
          </Card>
        </Grid>
      </Grid.Container>
    </MainLayout>
  );
};

export default PokemonByName;

export const getStaticPaths: GetStaticPaths<any> = async () => {
  const { data } = await axios_instance.get("/pokemon?limit=151");

  const paths = data.results.map(({ name }) => ({
    params: { name },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<any, { name: string }> = async ({
  params,
}) => {
  {
    var pokemon: Pokemon = null;
    try {
      var { data: pokemon } = await axios_instance.get<Pokemon>(
        `/pokemon/${params.name}`
      );
    } catch (error) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    return {
      props: {
        pokemon,
      },
    };
  }
};
