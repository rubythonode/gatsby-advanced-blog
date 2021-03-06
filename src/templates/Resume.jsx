import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import FaPinrt from 'react-icons/lib/fa/print';
import FaGithub from 'react-icons/lib/fa/github';
import FaFacebook from 'react-icons/lib/fa/facebook';
import FaTwitter from 'react-icons/lib/fa/twitter';
import FaLinkedin from 'react-icons/lib/fa/linkedin';
import fp from 'lodash/fp';
import { printPage } from '~/store/app/actions';
import Clearfix from '~/components/Common/Clearfix';
import * as profileUrl from '~/resources/me.png';

const Wrapper = styled.section`
  padding: 100px 0 0;
  @media (max-width: 414px) {
    padding: 70px 16px 0;
  }

  & > ${Clearfix} {
    margin: auto;
    max-width: 640px;
  }

  button {
    float: right;
  }
`;

const BasicInformation = styled.section`
  text-align: center;
  font-size: 16px;

  h1 {
    font-size: 2em;
    margin: .67em 0;
  }

  p {
    margin: .67em 0;
  }

  img {
    border-radius: 50%;
  }
`;

const SocialInformation = styled.section`
  font-size: 20px;
  text-align: center;

  a {
    padding: 0 6px;
  }
`;

const MDInformation = styled.section`
  font-size: 16px;

  h2 {
    font-size: 1.5em;
    margin: .67em 0;
  }

  ul {
    margin: 16px 0 0;
    padding: 0 0 0 20px;
    line-height: 2em;
    list-style: disc;
  }

  li ul {
    margin: 0 0 16px;;
    padding: 0 0 0 20px;
    list-style: circle;
  }

  a {
    text-decoration: underline;
  }
`;

class Resume extends PureComponent {
  static propTypes = {
    data: PropTypes.shape({ date: PropTypes.object }).isRequired,
    printPage: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const anchors = this.$mdWrapper.getElementsByTagName('a');

    fp.forEach((anchor) => {
      const href = anchor.getAttribute('href');
      if (fp.startsWith('http')(href)) {
        anchor.setAttribute('target', '_blank');
        anchor.setAttribute('rel', 'noreferrer noopener');
      }
    })(anchors);
  }

  render() {
    const { data } = this.props;
    const resume = fp.get('markdownRemark')(data);
    const siteTitle = fp.get('site.siteMetadata.title')(data);
    const title = `${fp.get('frontmatter.title')(resume)} | ${siteTitle}`;

    return (
      <Wrapper>
        <Clearfix>
          <Helmet>
            <title>{title}</title>
            <meta name="og:title" content={title} />
          </Helmet>
          <Clearfix>
            <button onClick={this.props.printPage}>
              <FaPinrt />Print
            </button>
          </Clearfix>
          <BasicInformation>
            <img
              src={profileUrl.default}
              alt=""
              width="120"
              height="120"
            />
            <h1>wonism</h1>
            <p>yocee57@gmail.com</p>
          </BasicInformation>
          <SocialInformation>
            <a
              href="https://github.com/wonism"
              target="_blank"
              rel="noreferrer noopener"
            >
              <FaGithub />
            </a>
            <a
              href="https://twitter.com/j1ism"
              target="_blank"
              rel="noreferrer noopener"
            >
              <FaTwitter />
            </a>
            <a
              href="https://www.facebook.com/j1.chic"
              target="_blank"
              rel="noreferrer noopener"
            >
              <FaFacebook />
            </a>
            <a
              href="https://www.linkedin.com/in/wonism/"
              target="_blank"
              rel="noreferrer noopener"
            >
              <FaLinkedin />
            </a>
          </SocialInformation>
          <MDInformation>
            {/* eslint-disable react/no-danger */}
            <div
              ref={(mdWrapper) => { this.$mdWrapper = mdWrapper; }}
              dangerouslySetInnerHTML={{ __html: fp.get('html')(resume) }}
            />
            {/* eslint-enable react/no-danger */}
          </MDInformation>
        </Clearfix>
      </Wrapper>
    );
  }
}

export default connect(
  state => state,
  {
    printPage,
  }
)(Resume);

/* eslint-disable no-undef */
export const pageQuery = graphql`
  query ResumeQuery ($path: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark (
      frontmatter: { path: { eq: $path } }
    ) {
      id
      html
      frontmatter {
        title
        path
        date
      }
    }
  }
`;
/* eslint-enable no-undef */
