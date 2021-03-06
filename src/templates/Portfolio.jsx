import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import fp from 'lodash/fp';
import SimpleWrapper from '~/components/Common/SimpleWrapper';
import { PRIMARY_COLOR } from '~/components/Common/constants';

const Wrapper = SimpleWrapper.extend`
  padding: 100px 0 0;
  @media (max-width: 414px) {
    padding: 70px 16px 0;
  }

  &:before,
  &:after {
    display: block;
    content: '';
    clear: both;
  }
`;

const PortfolioDescription = styled.section`
  float: left;
  padding: 0 0 0 36px;
  width: 50%;
  @media (max-width: 414px) {
    margin: 0 0 16px;
    padding: 0 0 16px;
    width: 100%;
  }

  h1 {
    margin: 0.67em 0;
    font-size: 28px;
  }

  h2 {
    margin: 0.67em 0;
    font-size: 20px;
  }

  ul {
    margin: 10px 0;
    padding: 0 0 0 40px;
    list-style: disc;
  }

  a {
    text-decoration: underline;
  }
`;

const PortfolioImages = styled.section`
  float: left;
  padding: 0 36px 0 0;
  width: 50%;
  height: calc(100vh - 100px);
  overflow-y: scroll;
  @media (max-width: 414px) {
    padding: 0;
    width: 100%;
    height: auto;
    overflow-y: visible;
  }

  img {
    padding: 16px;
    width: 100%;
    height: auto;
    @media (max-width: 414px) {
      float: left;
      margin: 0 0 8px;
      padding: 0;
      &:last-child {
        margin: 0 0 16px;
      }
    }
  }

  ::-webkit-scrollbar {
    width: 4px;
    height: 6px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: ${PRIMARY_COLOR};
    border-radius: 6px;
  }
`;

const Portfolio = ({
  data,
}) => {
  const portfolio = fp.get('markdownRemark')(data);
  const siteTitle = fp.get('site.siteMetadata.title')(data);
  const title = `${fp.get('frontmatter.title')(portfolio)} | ${siteTitle}`;
  const images = fp.get('frontmatter.images')(portfolio);

  return (
    <Wrapper>
      <Helmet>
        <title>{title}</title>
        <meta name="og:title" content={title} />
      </Helmet>
      <PortfolioDescription>
        {/* eslint-disable react/no-danger */}
        <section dangerouslySetInnerHTML={{ __html: fp.get('html')(portfolio) }} />
        {/* eslint-enable react/no-danger */}
      </PortfolioDescription>
      <PortfolioImages>
        {fp.map((image) => {
          if (fp.includes('//')(image)) {
            return (
              <img
                key={image}
                src={image}
                alt={fp.get('title')(portfolio)}
              />
            );
          }

          const url = require(`~/resources/${image}`);

          return (
            <img
              key={image}
              src={url}
              alt={fp.get('title')(portfolio)}
            />
          );
        })(images)}
      </PortfolioImages>
    </Wrapper>
  );
};

Portfolio.propTypes = {
  data: PropTypes.shape({ date: PropTypes.object }).isRequired,
};

export default Portfolio;

/* eslint-disable no-undef */
export const pageQuery = graphql`
  query PortfolioQuery ($path: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      id
      html
      frontmatter {
        title
        images
        date
      }
    }
  }
`;
/* eslint-enable no-undef */
