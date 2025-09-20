import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./styles/NewsUpdates.css";

const newsData = [
  {
    id: 1,
    title: "Golden Arrow Adds New Buses to Fleet",
    description:
      "20 brand new buses have been introduced to improve frequency on high-demand routes across Cape Town.",
    images: [
      "https://lh3.googleusercontent.com/34i762JH0a3mkmr4xSBUoyYjT-pyD9NMyZMCYxkLNuxugMJ9W3_QX_6aswuDmRVMiH8JEdEMYyEfPSwLI4lvATDpZcDc3e9v4A",
      "https://th.bing.com/th/id/OIP.JSaRVoP6qV935qeqSmJuLQHaEc?w=266&h=180&c=7&r=0&o=7&pid=1.7&rm=3",
      "https://cisp.cachefly.net/assets/articles/images/resized/0001189267_resized_gabsbydbus202521022.jpeg",

    ],
  },
  {
    id: 3,
    title: "Golden Arrow Suspends services at Town X due to strike",
    description:
      "GA paused it's service at town X due to an ongoing strike caused by ...",
    images: [
      "https://www.sabcnews.com/sabcnews/wp-content/uploads/2018/08/SABC-News-GoldenArrowBus-Facebook-SABCNewsWesternCape.png",
      "https://groundup.org.za/media/_versions/images/photographers/Ashraf%20Hendricks/taxistrike-20230810-6v2a1878hr_extra_large.jpg",
      "https://media.gettyimages.com/id/1590656119/video/cape-town-south-africa-3-august-cape-town-law-enforcement-officers-stand-outside-their-riot.jpg?s=640x640&k=20&c=XTM0FQRQKyNgTMIuu6aAF035hsiehuYL7WkfV_2JWks=",
    ],
  },
  {
    id: 2,
    title: "Golden Arrow Announces Weekend Service",
    description:
      "Golden Arrow will extend its weekend service hours to cater for late-night commuters starting November.",
    images: [
      "https://media-cache.primedia-service.com/media/3gapnw3p/240117-golden-arrow-buses.jpg",
      "https://smilefm.co.za/wp-content/uploads/2021/12/PAGE-9.jpg"

    ],
  },
];

const NewsUpdates = () => {
  const [activeImage, setActiveImage] = useState({});

  const handleImageClick = (newsId, img) => {
    setActiveImage((prev) => ({ ...prev, [newsId]: img }));
  };

  const speak = (text, lang = "en-US") => {
      const synth = window.speechSynthesis;

      // Cancel any ongoing speech first
      if (synth.speaking || synth.pending) {
        synth.cancel();
      }

      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = lang;

      synth.speak(utter);
    };

  useEffect(() => {
    const intervals = {};

    newsData.forEach((news) => {
      let index = 0;

      intervals[news.id] = setInterval(() => {
        index =
          (news.images.indexOf(activeImage[news.id]) + 1) % news.images.length;

        setActiveImage((prev) => ({
          ...prev,
          [news.id]: news.images[index],
        }));
      }, 4000); // 4 seconds per image
    });

    return () => {
      Object.values(intervals).forEach(clearInterval);
    };
  }, [newsData, activeImage]);

  return (
    <div className="ga-container">
      <h2 className="ga-title"> What is happening around you</h2>
      <div className="ga-grid">
        {newsData.map((news, index) => (
          <motion.div
            key={news.id}
            className="ga-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.2 }}
            whileHover={{ scale: 1.03 }}
          >
            <img
              src={activeImage[news.id] || news.images[0]}
              alt={news.title}
              className="ga-main-image"
            />
            <div className="ga-thumbnails">
              {news.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Thumbnail ${i}`}
                  className={`ga-thumbnail ${
                    activeImage[news.id] === img ? "ga-active-thumb" : ""
                  }`}
                  onClick={() => handleImageClick(news.id, img)}
                />
              ))}
            </div>
            <div className="ga-content">
              <h3 className="ga-card-title">{news.title}</h3>
              <p className="ga-description">{news.description}</p>
              <button className="ga-btn">Read More</button>
              <br></br>
              <i
            className="fa fa-volume-up"
            aria-hidden="true"
            style={{ cursor: "pointer", marginLeft: "8px" }}
            onClick={()=>speak("News brought to you by Ride logic. \n \n"+ news.description, 'en-SA')}
          ></i>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default NewsUpdates;
