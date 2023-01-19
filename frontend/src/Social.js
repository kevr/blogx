const SOCIAL_LOGOS = {
  Github: "/images/github-white.png",
  Facebook: "/images/facebook.png",
  Twitter: "/images/twitter.png",
};

const Social = ({ data }) => (
  <div className="flex-display flex-row">
    <div className="social-image">
      <a href={data.url} target="_blank" rel="noreferrer">
        <img
          width="32px"
          src={SOCIAL_LOGOS[data.location]}
          alt={`${data.location} logo`}
          className="social-media-logo"
          data-testid="social-image"
        />
      </a>
    </div>
    <div className="social-link flex-display flex-col">
      <div className="flex"></div>
      <div>
        <a
          href={data.url}
          target="_blank"
          rel="noreferrer"
          data-testid="social-link"
        >
          {data.url}
        </a>
      </div>
      <div className="flex"></div>
    </div>
  </div>
);

export default Social;
