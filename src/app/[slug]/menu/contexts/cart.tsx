"use client";

import { Product } from "@prisma/client";
import { createContext, ReactNode, useState } from "react";

export interface CartProduct 
    extends Pick<Product, 'id' | 'name' | 'price' | 'imageUrl'> {
    quantity: number
}

export interface ICartContext {
    isOpen: boolean,
    products: CartProduct[],
    total: number,
    totalQuantity: number,
    toggleCart: () => void,
    addProduct: (product: CartProduct) => void,
    decreaseProductQuantity: (productId: string) => void,
    increaseProductQuantity: (productId: string) => void,
    removeProduct: (productId: string) => void
}

export const CartContext = createContext<ICartContext>({
    isOpen: false,
    products: [],
    total: 0,
    totalQuantity: 0,
    toggleCart: () => {},
    addProduct: () => {},
    decreaseProductQuantity: () => {},
    increaseProductQuantity: () => {},
    removeProduct: () => {}
})

export const CartProvider = ({children}: {children: ReactNode}) => {
    const [products, setProducts] = useState<CartProduct[]>([]);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const total = products.reduce((acc, product) => {
        return acc + product.price * product.quantity
    }, 0)
    const totalQuantity = products.reduce((acc, product) => {
        return acc + product.quantity;
    }, 0)
    const toggleCart = () => {
        setIsOpen(prev => !prev)
    }
    const addProduct = (product: CartProduct) => {
        if (!products.some((prevProduct) => prevProduct.id == product.id)) {
            return setProducts((prev) => [...prev, product]);
        }

        setProducts(prevProducts => {
            return prevProducts.map(prevProduct => {
                if (prevProduct.id == product.id) {
                    return {
                        ...prevProduct, quantity: prevProduct.quantity + product.quantity
                    }
                }
                return prevProduct;
            })
        })
    }
    const decreaseProductQuantity = (productId: string) => {
        setProducts(prevProducts => {
            return prevProducts.map(prevProduct => {
                if (prevProduct.id == productId) {
                    return prevProduct.quantity != 1 ? {...prevProduct, quantity: prevProduct.quantity - 1} : {...prevProduct, quantity: prevProduct.quantity}
                }
                return prevProduct;
            })
        })
    }
    const increaseProductQuantity = (productId: string) => {
        setProducts(prevProducts => {
            return prevProducts.map(prevProduct => {
                return prevProduct.id == productId ? {...prevProduct, quantity: prevProduct.quantity + 1} : prevProduct;
            })
        })
    }
    const removeProduct = (productId: string) => {
        setProducts(prevProducts => prevProducts.filter(prevProduct => prevProduct.id != productId));
    }
    return (
        <CartContext.Provider value={{
            isOpen,
            products,
            total,
            totalQuantity,
            toggleCart,
            addProduct,
            decreaseProductQuantity,
            increaseProductQuantity,
            removeProduct
        }}>
            {children}
        </CartContext.Provider>
    );
};