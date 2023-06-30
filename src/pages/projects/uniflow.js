import React, { useRef, useEffect } from 'react';
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { Layout } from '@components';
import { Icon } from '@components/icons';
import { usePrefersReducedMotion } from '@hooks';

const StyledTableContainer = styled.div`
  margin: 100px -20px;

  @media (max-width: 768px) {
    margin: 50px -10px;
  }

  table {
    width: 100%;
    border-collapse: collapse;

    .hide-on-mobile {
      @media (max-width: 768px) {
        display: none;
      }
    }

    tbody tr {
      &:hover,
      &:focus {
        background-color: var(--light-navy);
      }
    }

    th,
    td {
      padding: 10px;
      text-align: left;

      &:first-child {
        padding-left: 20px;

        @media (max-width: 768px) {
          padding-left: 10px;
        }
      }
      &:last-child {
        padding-right: 20px;

        @media (max-width: 768px) {
          padding-right: 10px;
        }
      }

      svg {
        width: 20px;
        height: 20px;
      }
    }

    tr {
      cursor: default;

      td:first-child {
        border-top-left-radius: var(--border-radius);
        border-bottom-left-radius: var(--border-radius);
      }
      td:last-child {
        border-top-right-radius: var(--border-radius);
        border-bottom-right-radius: var(--border-radius);
      }
    }

    td {
      &.year {
        padding-right: 20px;

        @media (max-width: 768px) {
          padding-right: 10px;
          font-size: var(--fz-sm);
        }
      }

      &.title {
        padding-top: 15px;
        padding-right: 20px;
        color: var(--lightest-slate);
        font-size: var(--fz-xl);
        font-weight: 600;
        line-height: 1.25;
      }

      &.company {
        font-size: var(--fz-lg);
        white-space: nowrap;
      }

      &.tech {
        font-size: var(--fz-xxs);
        font-family: var(--font-mono);
        line-height: 1.5;
        .separator {
          margin: 0 5px;
        }
        span {
          display: inline-block;
        }
      }

      &.links {
        min-width: 100px;

        div {
          display: flex;
          align-items: center;

          a {
            ${({ theme }) => theme.mixins.flexCenter};
            flex-shrink: 0;
          }

          a + a {
            margin-left: 10px;
          }
        }
      }
    }
  }
`;


const UniflowPage = ({ location, data }) => {
    const projects = data.allMarkdownRemark.edges;

    const revealContainer = useRef(null);
    const prefersReducedMotion = usePrefersReducedMotion();

    useEffect(() => {
        if (prefersReducedMotion) {
            return;
        }

        sr.reveal(revealContainer.current, srConfig());
    }, []);


    return (
        <Layout location={location}>
            <Helmet title="MyToyota" />

            <main ref={revealContainer}>
                <header>
                    <h1 className="big-heading">MyToyota</h1>
                    {/* <p className="subtitle">Toyota Algerie </p> */}
                </header>

                <div style={{"margin-top":"40px"}}>
                    <p>
                        A minimal, dark blue theme for VS Code, Sublime Text, Atom, iTerm, and more. Available on [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=brittanychiang.halcyon-vscode), [Package Control](https://packagecontrol.io/packages/Halcyon%20Theme), [Atom Package Manager](https://atom.io/themes/halcyon-syntax), and [npm](https://www.npmjs.com/package/hyper-halcyon-theme).
                    </p>
                </div>



                <StyledTableContainer >
                    <table>
                        <thead>
                            <tr>
                                <th>Year</th>
                                <th>Title</th>
                                <th className="hide-on-mobile">Made at</th>
                                <th className="hide-on-mobile">Built with</th>
                                <th>Link</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.length > 0 &&
                                projects.map(({ node }, i) => {
                                    const {
                                        date,
                                        github,
                                        external,
                                        ios,
                                        android,
                                        title,
                                        tech,
                                        company,
                                    } = node.frontmatter;
                                    return (
                                        <tr key={i} >
                                            <td className="overline year">{`${new Date(date).getFullYear()}`}</td>

                                            <td className="title">{title}</td>

                                            <td className="company hide-on-mobile">
                                                {company ? <span>{company}</span> : <span>—</span>}
                                            </td>

                                            <td className="tech hide-on-mobile">
                                                {tech?.length > 0 &&
                                                    tech.map((item, i) => (
                                                        <span key={i}>
                                                            {item}
                                                            {''}
                                                            {i !== tech.length - 1 && <span className="separator">&middot;</span>}
                                                        </span>
                                                    ))}
                                            </td>

                                            <td className="links">
                                                <div>
                                                    {external && (
                                                        <a href={external} aria-label="External Link">
                                                            <Icon name="External" />
                                                        </a>
                                                    )}
                                                    {github && (
                                                        <a href={github} aria-label="GitHub Link">
                                                            <Icon name="GitHub" />
                                                        </a>
                                                    )}
                                                    {ios && (
                                                        <a href={ios} aria-label="Apple App Store Link">
                                                            <Icon name="AppStore" />
                                                        </a>
                                                    )}
                                                    {android && (
                                                        <a href={android} aria-label="Google Play Store Link">
                                                            <Icon name="PlayStore" />
                                                        </a>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </StyledTableContainer>
            </main>
        </Layout>
    );
};
UniflowPage.propTypes = {
    location: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
};

export default UniflowPage;

export const pageQuery = graphql`
  {
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/content/projects/" } }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      edges {
        node {
          frontmatter {
            date
            title
            tech
            github
            external
            ios
            android
            company
          }
          html
        }
      }
    }
  }
`;
