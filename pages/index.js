import { css } from '@emotion/core';
import React, { useState } from 'react';
import Layout from '../components/Layout';
import RenderAPI from '../components/RenderAPI';
import { colors } from '../util/colors';
import {
  findMatchingObjectBasedOnIng,
  transformTheIngArray,
} from '../util/helperFunctions';

const grid = css`
  background-color: ${colors.almostwhite};
  margin: 50px 0 50px 350px;
  width: calc(100% - 400px);
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  div {
    margin-bottom: 100px;
    width: 300px;
    height: 380px;
    margin-bottom: 50px;
  }
`;

export default function Home(props) {
  const [userIngArray, setUserIngArray] = useState([]);
  const simlifiedArray = transformTheIngArray(userIngArray);
  const matchingIngObj = findMatchingObjectBasedOnIng(
    props.foodDataBase,
    simlifiedArray,
  );
  console.log(matchingIngObj);
  return (
    <Layout userIngArray={userIngArray} setUserIngArray={setUserIngArray}>
      <div css={grid}>
        <RenderAPI matchingIngObj={matchingIngObj} />
        {console.log(matchingIngObj)}
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  const { getRecipes } = await import('../util/foodDataBase');
  const foodDataBase = await getRecipes();

  return {
    props: {
      foodDataBase: foodDataBase,
    },
  };
}
