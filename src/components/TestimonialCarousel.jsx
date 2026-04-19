import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import TestimonialCard from './TestimonialCard';

export default function TestimonialCarousel({ testimonials }) {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={30}
      slidesPerView={1}
      pagination={{ clickable: true }}
      navigation={true}
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      breakpoints={{
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }}
      className="w-full"
    >
      {testimonials.map((testimonial, index) => (
        <SwiperSlide key={testimonial.id}>
          <TestimonialCard testimonial={testimonial} index={index} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}