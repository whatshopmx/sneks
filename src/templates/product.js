import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { graphql, navigate } from 'gatsby';
import { formatCurrencyString } from 'use-shopping-cart';

import { SEO, SocialLinks, Footer, ProductInfo } from '@components'; 
import { mixins, media } from '@styles';
const slugify = require('slugify');

const StyledWrapper = styled.div`
    ${mixins.sidePadding};
    ${mixins.fullHeight};
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    position: relative;

    ::before {
      content: '';
      position: absolute;
      width: 450px;
      height: 100%;
      background-color: ${({ theme }) => theme.gray100 };
      z-index: -1;
      left: 50%;
      transform: translateX(-50%);

      ${media.desktop`width: 400px;`};
      ${media.tablet`width: 350px;`};
      ${media.thone`width: 250px;`};
      ${media.phablet`width: 100%;`};
    }
`;

const StyledImage = styled.img`
    ${media.desktop`width: 75%;`};
`;

const ImageWrapper = styled.div`
  ${mixins.flexCenter};
  grid-column: 1/13;
  grid-row: 1;
  margin-top: 100px;
  ${media.phablet`margin-left: -50px;`};
`;

const ProductLayout =  ({ data }) => {
    const [next, setNext] = useState('');
    const [previous, setPrevious] = useState('');

    const { id, price, currency, attributes: { name }, localFiles } = data.stripeSku;
    const items = data.allStripeSku.edges.map(elm => elm.node.attributes.name);
    const index = items.indexOf(name);

    const handleNavigate = (path) => navigate(`products/${path}`);

    useEffect(() => {
      
      if(items[index +1] === undefined) {
        setNext('');
      } else {
        setNext(slugify(items[index + 1], { lower: true }));
      }

      if(items[index -1] === undefined) {
        setPrevious('');
      } else {
        setPrevious(slugify(items[index - 1], { lower: true }));
      }

    }, [data, name, index, items]);

    const sku = {
      name,
      currency,
      price,
      sku: id,
      image: localFiles[0].childImageSharp.fluid
    }

    const formattedPrice = formatCurrencyString({
      value: price,
      currency,
      language: 'en'
    });

    return(
      <StyledWrapper>
        <SEO title={name} />
        <ProductInfo name={name} price={formattedPrice} sku={sku} />
        <ImageWrapper>
          <StyledImage src={sku.image.src} srcSet={sku.image.srcSet} sizes={sku.image.sizes} />
        </ImageWrapper>
        <SocialLinks />
        <Footer next={next} previous={previous} handleNavigate={handleNavigate} idx={index} length={items.length} />
      </StyledWrapper>
    ) 
}

export const query = graphql`
  query MyQuery($name: String!) {
    stripeSku(attributes: {name: {eq: $name}}) {
      id
      price
      currency
      attributes {
        name
      }
      localFiles {
        childImageSharp {
          fluid(maxWidth: 600) {
            src
            srcSet
            sizes
          }
        }
      }
    }
    allStripeSku {
      edges {
        node {
          attributes {
            name
          }
        }
      }
    }
  }
`;

export default ProductLayout;
