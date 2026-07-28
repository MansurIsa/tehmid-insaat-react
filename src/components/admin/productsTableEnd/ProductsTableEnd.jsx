import React from 'react';
import { AiTwotoneDelete } from 'react-icons/ai';
import { FaPenToSquare } from 'react-icons/fa6';
import { useDispatch } from 'react-redux';
import { productsDeleteModalFunc, setUpdateProductsObjFunc } from '../../../redux/slices/admin/productTableSlice';
import { useNavigate } from 'react-router-dom';

const ProductsTableEnd = ({ productsList }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const currencyMap = { D: "$", M: "₼", R: "₽" };

    const deleteProducts = (id) => dispatch(productsDeleteModalFunc(id));

    const updateProducts = (item) => {
        dispatch(setUpdateProductsObjFunc(item));
        navigate("/update-new-products");
    };

    // Ölçü vahidini göstərmək üçün funksiya
    const getUnitDisplay = (item) => {
        if (item.unit === 'kg') return 'Kiloqram';
        if (item.unit === 'metre') return 'Metr';
        if (item.unit === 'piece') {
            // Əgər məhsulun çəkisi və ya uzunluğu varsa, onu da göstər
            let display = 'Ədəd';
            if (item.unit_weight) {
                display += ` (${item.unit_weight} kq)`;
            } else if (item.unit_length) {
                display += ` (${item.unit_length} m)`;
            }
            return display;
        }
        return '-';
    };

    // Məhsulun miqdarını göstərmək üçün funksiya
    const getAmountDisplay = (item) => {
        if (item.amount === null || item.amount === undefined) return '-';
        
        let amount = item.amount;
        // Əgər unit 'piece' dirsə, tam ədəd göstər
        if (item.unit === 'piece') {
            return Math.round(amount).toString();
        }
        return amount;
    };

    // Ümumi çəki və ya uzunluğu hesablamaq üçün funksiya
    const getTotalMeasureDisplay = (item) => {
        if (!item.amount) return null;
        
        if (item.unit === 'piece') {
            if (item.unit_weight) {
                const totalWeight = (item.amount * item.unit_weight).toFixed(2);
                return `${totalWeight} kq (cəmi)`;
            }
            if (item.unit_length) {
                const totalLength = (item.amount * item.unit_length).toFixed(2);
                return `${totalLength} m (cəmi)`;
            }
            return null;
        }
        return null;
    };

    console.log(productsList);

    return (
        <div className="admin_container">
            <div className='table_wrapper'>
                <table className='custom_table'>
                    <thead>
                        <tr>
                            <th>Məhsul Adı</th>
                            <th>Artikl</th>
                            <th>Ölçü vahidi</th>
                            <th>Miqdar</th>
                            <th>Maya Dəyəri</th>
                            <th>Alış Qiyməti</th>
                            <th>Satış Qiyməti</th>
                            <th>Endirimli Qiymət</th>
                            <th>Düzəliş/Sil</th>
                        </tr>
                    </thead>

                    <tbody>
                        {productsList?.map((item, index) => (
                            <tr key={index}>
                                <td>
                                    {item?.name || "-"}
                                    {/* Əgər məhsulun ümumi çəkisi/uzunluğu varsa göstər */}
                                    {getTotalMeasureDisplay(item) && (
                                        <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
                                            {getTotalMeasureDisplay(item)}
                                        </div>
                                    )}
                                </td>
                                <td className='table_article_scroll'>
                                    {item?.articles?.map(a => a.name).join(', ') || "-"}
                                </td>
                                <td>
                                    {getUnitDisplay(item)}
                                </td>
                                <td>
                                    {getAmountDisplay(item)}
                                </td>
                                <td>{item?.cost_price ? item.cost_price + " ₼" : "-"}</td>
                                <td>{item?.purchase_price} {currencyMap[item?.currency] || ""}</td>
                                <td>{item?.price ? item.price + " ₼" : "-"}</td>
                                <td>{item?.discount_price ? item.discount_price + " ₼" : "-"}</td>
                                <td className='table_update'>
                                    <FaPenToSquare onClick={() => updateProducts(item)} />
                                    <AiTwotoneDelete onClick={() => deleteProducts(item?.id)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductsTableEnd;