export class GetOrderDto {
    id: string;
    status: string;
    cartId: string;
    totalPrice: number;
    totalPayment: number;
    updated: Date;
    created: Date;
    articles: [
        {
            id: string,
            quantity: number,
            unitaryPrice: number,
            validated: true,
            valid: true
        }
    ];
    payment: [any]

}