import useFetch from "@/hooks/useFetch";
import { User } from "@/models/user-model";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { formatCardNumberWithSpacing, formatDate } from "@/utils/formatter";

const ProfileOrders = () => {
  const { data } = useFetch<User>({
    path: "/api/users/me",
    skipRequestIfNoToken: true,
    params: {
      populate: "orders",
    },
  });

  const orders = data?.orders;

  return (
    <div className="space-y-4">
      <Accordion type="multiple" className="w-full space-y-4 my-10">
        {orders?.map((order, index) => (
          <AccordionItem
            key={order.documentId}
            value={`order-${index}`}
            className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 bg-white overflow-hidden"
          >
            {/* Order Summary Header */}
            <div className="p-6 bg-gradient-to-r from-gray-50 to-transparent">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">
                  Order #{order.documentId.slice(-8).toUpperCase()}
                </h3>
                <span className="text-lg font-bold text-primary">
                  ${order.totalPrice}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-x-10 lg:gap-x-20 text-sm [&>div]:flex [&>div]:justify-between [&>div>span:first-child]:font-medium [&>div>span:first-child]:text-gray-700 [&>div>span:last-child]:text-gray-600">
                <div>
                  <span>Placed on</span>
                  <span>{formatDate(order.createdAt)}</span>
                </div>
                <div>
                  <span>Card</span>
                  <span>{formatCardNumberWithSpacing(order.cardNumber)}</span>
                </div>
                <div className="md:col-span-2">
                  <span>Delivery</span>
                  <span className="text-end">{order.deliveryAddress}</span>
                </div>
              </div>
            </div>

            {/* Items Accordion */}
            <div className="border-t border-gray-100">
              <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 text-sm font-medium text-gray-700">
                View Items ({order.itemsDetails?.length || 0})
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 bg-gray-50/30">
                <div className="space-y-4 pt-2">
                  {order.itemsDetails.map((item, i) => (
                    <div
                      key={i}
                      className="border-l-4 border-primary pl-4 py-2 bg-white rounded-r-md"
                    >
                      <div className="space-y-1">
                        <div className="font-semibold text-gray-900">
                          {item.itemTitle}
                        </div>
                        <div className="flex gap-4 text-sm text-gray-600">
                          <span>${item.itemPrice}</span>
                          <span>Qty: {item.itemNum}</span>
                          <span>Color: {item.itemColor}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </div>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default ProfileOrders;
