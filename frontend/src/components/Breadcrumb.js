import React from 'react';
import { Breadcrumb } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Breadcrumb.css';

const CustomBreadcrumb = ({ items }) => {
    return (
        <Breadcrumb className="custom-breadcrumb">
            {items.map((item, index) => (
                <Breadcrumb.Item 
                    key={index}
                    active={index === items.length - 1}
                    linkAs={index === items.length - 1 ? 'span' : Link}
                    linkProps={index === items.length - 1 ? {} : { to: item.path }}
                >
                    {item.label}
                </Breadcrumb.Item>
            ))}
        </Breadcrumb>
    );
};

export default CustomBreadcrumb;
