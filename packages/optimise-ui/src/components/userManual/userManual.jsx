import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import ImageZoom from 'react-medium-image-zoom';
import Helmet from '../scaffold/helmet';
import style from './userManual.module.css';
import markup from './userManual.md';

export default class UserManual extends Component {

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <>
                <div className={style.ariane}>
                    <Helmet title='User Manual' />
                    <h2>User Manual</h2>
                </div>
                <div className={style.panel}>
                    <ReactMarkdown source={markup} escapeHtml={false} renderers={{
                        image: ({ alt, src }) => <ImageZoom
                            image={{
                                src,
                                alt,
                            }}
                            zoomImage={{
                                className: style.zoomedImage,
                            }}
                            defaultStyles={{
                                image: {
                                    // marginLeft: '0%'
                                },
                                zoomImage: {
                                    // transition: 'transform 300ms ease 0s, margin-left 300ms ease 0s',
                                    // marginLeft: '50%'
                                },
                                zoomContainer: {
                                    position: 'absolute'
                                }
                            }}
                        />
                    }} />
                </div>
            </>
        );
    }
}
