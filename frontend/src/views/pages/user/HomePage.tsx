
import '../../../assets/css/user/Home.css'
import UserNav from '../../partials/user/UserNav'
import React, { useRef } from 'react';
import i4 from '/images/cosySec.png';
import i5 from '/images/cosySec (2).webp';
import i7 from '/images/cosySec (1).webp';
import ix from '/images/cosySec (3).webp';
import { useNavigate } from 'react-router-dom';



const modelImages: Record<'i4' | 'i5' | 'i7' | 'ix' , string> = {
  i4,
  i5,
  i7,
  ix,
 
};

const modelKeys = ['i4', 'i5', 'i7', 'ix',] as const;
type ModelKey = typeof modelKeys[number];

function HomePage() {

const modelsSectionRef = useRef<HTMLDivElement | null>(null);

  return (
    <>
    <UserNav />
    <div className="homePageUserContainer">
      <section className="homePageUserHero">
        <div className="homePageUserHeroText">
          <h1>BMW ELECTRIC CARS</h1>
         <button onClick={() => modelsSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}>
  Explore the Models
</button>
        </div>
      </section>

      <section  className="homePageUserIntro">
        <h2>THE BMW ELECTRIC CARS.</h2>
        <p>Discover the joy of electric driving in a BMW.</p>
      </section>

      <section className="homePageUserModels" ref={modelsSectionRef}>
        <h3>EXPERIENCE THE JOY OF ELECTRIC DRIVING</h3>
        <div className="homePageUserModelGrid">
          {modelKeys.map((model: ModelKey, index) => (
  <div className="homePageUserModelCard" key={index}>
    <img src={modelImages[model]} alt={`BMW ${model}`} />
    <h4>The BMW {model.toUpperCase()}</h4>
    <p>Discover the features of the BMW {model.toUpperCase()}.</p>
   
  </div>
))}

        </div>
      </section>

      <section className="homePageUserFind">
        <h3>FIND YOUR BMW ELECTRIC CAR.</h3>
        <div className="homePageUserFindDetails">
          <ul>
            <li>Light and fast navigation</li>
            <li>Detailed filters</li>
            <li>Comparison of different models</li>
          </ul>
          <img src="\images\cosy.webp" alt="Find your car" />
        </div>
      </section>

      <section className="homePageUserFinance">
        <h3>BMW 360° FINANCE.</h3>
        <div className="homePageUserFinanceBox">
          <img src="\images\1746516605683vexqtpi0.webp" alt="Finance options" />
          <p>Explore flexible BMW financing tailored to your needs.</p>
        </div>
      </section>

      <section className="homePageUserFAQ">
        <h3>FAQ</h3>
        <ul>
          <li>What is the range of a BMW electric car?</li>
          <li>How long does it take to charge?</li>
          <li>Where can I find charging stations?</li>
          <li>Is servicing different for electric models?</li>
        </ul>
      </section>
    </div>
  );
    </>
  )
}

export default HomePage