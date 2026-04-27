import React from "react";
import "./CustomeSlider.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CustomeSlider = ({children, xl = 4, lg = 3, md = 2, sm = 1}) => {
    function NextArrow(props) {
        const {className, style, onClick} = props;
        return (
            <div
                className={className + " custome-slider"}
                style={style}
                onClick={onClick}
            />
        );
    }

    function PrevArrow(props) {
        const {className, style, onClick} = props;
        return (
            <div
                className={className + " custome-slider"}
                style={style}
                onClick={onClick}
            />
        );
    }

    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        initialSlide: 0,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {breakpoint: 1200, settings: {slidesToShow: xl}},
            {breakpoint: 992, settings: {slidesToShow: lg}},
            {breakpoint: 768, settings: {slidesToShow: md}},
            {breakpoint: 576, settings: {slidesToShow: sm}},
        ],
    };
    return <Slider {...settings}>{children}</Slider>;
};

export default CustomeSlider;
