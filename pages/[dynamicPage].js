import Header from '../components/Header';
import Link from 'next/link';
import React from 'react';
import { css } from '@emotion/core';
import { colors } from '../util/colors';
import nextCookies from 'next-cookies';
import { isSessionTokenValid } from '../util/auth';
import { getUserBySessionToken } from '../util/DataBaseUser';

const container1 = css`
  display: grid;
  grid-template-columns: 35% 5% 40%;
  grid-template-rows: 25% 5% 60% 5% 1fr;
  margin-bottom: 190px;

  justify-content: center;
  h1 {
    padding: 0;
    grid-column: 1 / 4;
    grid-row: 1 / 1;
    text-decoration: underline;
    display: inline;
    text-transform: uppercase;
    font-size: 300%;
    font-weight: lighter;
    letter-spacing: 4px;
    word-spacing: 6px;
  }
  .picture {
    grid-column: 1 / 3;
    grid-row: 3 / 4;
    background-color: ${colors.almostwhite};
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    z-index: 55;
    border-radius: 20px;
    button {
      background-color: ${colors.orange};
      height: 55px;
      width: 55px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: -10px 0 0 -10px;
      border: none;
      cursor: pointer;
      transition: 0.2s;
      transition-timing-function: ease-out;
      img {
        height: 30px;
      }
      :hover {
        background-color: ${colors.darkorange};
        transform: translate(0, 1px);
      }
    }
  }
  .textbox {
    grid-column: 2 / 4;
    grid-row: 2 / 6;
    width: 100%;
    background-color: ${colors.darkorange};
    color: ${colors.almostwhite};
    padding: 5% 5% 5% 20%;
    border-radius: 20px;
    h2:first-child {
      display: inline;
      font-size: 100%;
      font-weight: 400;
      letter-spacing: 3px;
      word-spacing: 5px;
      line-height: 180%;
      opacity: 90%;
      border-bottom: none;
    }
    h2 {
      display: inline;
      text-transform: uppercase;
      font-size: 130%;
      font-weight: 500;
      border-bottom: 2px solid ${colors.almostwhite};
      letter-spacing: 3px;
      word-spacing: 5px;
    }
    p {
      opacity: 80%;
      font-size: 90%;
    }
    ol {
      padding: 10px 0;
    }
    li {
      opacity: 90%;
      font-size: 90%;

      line-height: 150%;
      letter-spacing: 1.5px;
      word-spacing: 2px;
      margin-left: 20px;

      :first-letter {
        text-transform: uppercase;
      }
    }

    a {
      color: ${colors.orange};
      font-weight: bold;
      text-decoration: underline;
    }
  }
`;
const opacitiy = css`
  opacity: 95%;
  font-size: 130%;
`;

function Spices(props) {
  return (
    <div>
      <p>
        <p>
          Sure if you have {props.food.spices.join(', ')} laying around this
          would add some more flavor to it but its not essetial.
        </p>
      </p>
    </div>
  );
}

export default function ProductPage(props) {
  const food = props.foodDataBase.find((currentRecipe) => {
    if (currentRecipe.id.toString() === props.id) {
      return true;
    }
    return false;
  });
  async function handleUpload(e) {
    e.preventDefault();

    const response = await fetch('/api/dynamicpage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipeId: props.id,
        userId: props.user.id,
      }),
    });
    const { success } = await response.json();
    console.log(success);
  }
  return (
    <>
      <Header loggedIn={props.loggedIn} />{' '}
      <div css={container1}>
        <div
          style={{
            backgroundImage: 'url(' + food.img + ')',
          }}
          className="picture"
        >
          <button onClick={handleUpload}>
            <img src="save.svg" alt="Logo" />
          </button>
        </div>
        <div className="textbox">
          <h2>
            Enjoy no trouble
            <br />
            <h2> {food.name}</h2>
          </h2>

          <p>
            If we are honest with our selfs this recipe only need{' '}
            <b>{food.ingredients.length}</b> real ingredients:
          </p>
          <ol css={opacitiy}>
            {food.ingredients.map((ing) => {
              return <li>{ing}</li>;
            })}
          </ol>
          {food.spices.length !== 0 ? <Spices food={food} /> : null}

          <p>
            You can use this{' '}
            {
              <Link href={food.link}>
                <a>recepy</a>
              </Link>
            }{' '}
            as giadance but reber, only {food.ingredients.length} ingredients
            are really neccercary &#128521;{' '}
          </p>
        </div>
        <h1>{food.name}</h1>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const { getRecipesForProductPage } = await import(
    '../util/DataBaseProductPageQuery'
  );
  const { session: token } = nextCookies(context);
  const loggedIn = await isSessionTokenValid(token);
  const foodDataBase = await getRecipesForProductPage();
  const user = await getUserBySessionToken(token);
  return {
    props: {
      id: context.query.dynamicPage,
      foodDataBase: foodDataBase,
      loggedIn: loggedIn,
      user: user,
    },
  };
}
