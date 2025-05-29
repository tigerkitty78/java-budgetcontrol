import { useSelector } from "react-redux";
import Card from "./card";
import { useDispatch } from 'react-redux';
import { getCategories } from '../Redux/ExpenseSlice';
import React, { useEffect } from 'react';
function Carousel() {
    const dispatch = useDispatch();
    const categories = useSelector((state) => state.expenseSlice.categories);

    useEffect(() => {
        dispatch(getCategories());
    }, [dispatch]);

    return (
        <div className="carousel container-fluid px-3">
            <div
                className="d-flex flex-nowrap overflow-auto"
                style={{ scrollbarWidth: 'thin', gap: '1rem' }}
            >
                {categories && categories.length > 0 ? (
                    categories.map((category, index) => (
                        <div key={index} className="flex-shrink-0">
                            <Card category={category} />
                        </div>
                    ))
                ) : (
                    <p>Loading categories...</p>
                )}
            </div>
        </div>
    );
}

export default Carousel;
  