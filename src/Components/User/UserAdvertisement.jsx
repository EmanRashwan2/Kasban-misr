"use client"
import React from 'react'
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import { deleteAdvertisementApi, getAddedPropertiesApi } from "@/store/actions/campaign";
import toast from "react-hot-toast";
import { Menu, Dropdown, Button } from "antd";
import { settingsData } from "@/store/reducer/settingsSlice";
import { useSelector } from "react-redux";
import ReactPagination from "@/Components/Pagination/ReactPagination.jsx";
import Loader from "@/Components/Loader/Loader";
import { FaCrown } from "react-icons/fa";
import { formatPriceAbbreviated, placeholderImage, translate } from "@/utils/helper.js";
import { languageData } from "@/store/reducer/languageSlice";
import Image from "next/image";
import dynamic from "next/dynamic.js";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { DeleteOutlined } from '@mui/icons-material';
import { useRouter } from 'next/router.js';
import withAuth from '../Layout/withAuth.jsx';
const VerticleLayout = dynamic(() => import('../../../src/Components/AdminLayout/VerticleLayout.jsx'), { ssr: false })


const UserAdvertisement = () => {
    const limit = 8;
    const router = useRouter()
    const [Data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [offsetdata, setOffsetdata] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const priceSymbol = useSelector(settingsData);
    const CurrencySymbol = priceSymbol && priceSymbol.currency_symbol;
    const lang = useSelector(languageData);

    const handleView = (slug) => {
        router.push(`/properties-details/${slug}`)
    }

    const handleClickDelete = (id) => {
        deleteAdvertisementApi({
            id:id,
            onSuccess:(res)=>{
                toast.success(res.message)
                getAddedPropertiesApi({
                    is_promoted: "1",
                    offset: offsetdata.toString(),
                    limit: limit.toString(),
                    onSuccess: (response) => {
                        setTotal(response.total);
                        const FeaturedListingData = response.data;
                        setIsLoading(false);
                        setData(FeaturedListingData);
                    },
                    onError: (error) => {
                        setIsLoading(false);
                        console.log(error);
                    }
                })
            },
            onError:(err)=>{
                console.log(err)
                toast.error(err)
            }
        })
        
    }
    useEffect(() => { }, [lang]);
    // api call
    useEffect(() => {
        setIsLoading(true);
        getAddedPropertiesApi({
            is_promoted: "1",
            offset: offsetdata.toString(),
            limit: limit.toString(),
            onSuccess: (response) => {
                setTotal(response.total);
                const FeaturedListingData = response.data;
                setIsLoading(false);
                setData(FeaturedListingData);
            },
            onError: (error) => {
                setIsLoading(false);
                console.log(error);
            }
        }
        )
    }, [offsetdata]);

    const handlePageChange = (selectedPage) => {
        const newOffset = selectedPage.selected * limit;
        setOffsetdata(newOffset);
        window.scrollTo(0, 0);
    };

    return (
        <VerticleLayout>
            <div className="container">
                <div className="tranction_title">
                    <h1>{translate("myAdvertisement")}</h1>
                </div>

                <div className="table_content card bg-white">
                    <TableContainer
                        component={Paper}
                        sx={{
                            background: "#fff",
                            padding: "10px",
                        }}
                    >
                        <Table sx={{ minWidth: 650 }} aria-label="caption table">
                            <TableHead
                                sx={{
                                    background: "#f5f5f5",
                                }}
                            >
                                <TableRow>
                                    <TableCell sx={{ fontWeight: "600" }}>{translate("listingTitle")}</TableCell>
                                    <TableCell sx={{ fontWeight: "600" }} align="center">
                                        {translate("status")}
                                    </TableCell>
                                    {/* <TableCell sx={{ fontWeight: "600" }} align="center">
                                        {translate("type")}
                                    </TableCell> */}
                                    <TableCell sx={{ fontWeight: "600" }} align="center">
                                        {translate("action")}
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">
                                            {/* Centered loader */}
                                            <div>
                                                <Loader />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : Data.length > 0 ? (
                                    Data && Data.map((elem, index) => (
                                        <TableRow key={index}>
                                            <TableCell component="th" scope="row" sx={{ width: "40%" }}>
                                                <div className="card" id="listing_card">
                                                    <div className="listing_card_img">
                                                        <Image loading="lazy" src={elem?.title_image} alt="no_img" id="main_listing_img" width={150} height={0} style={{ height: "auto" }} onError={placeholderImage} />
                                                        <span className="listing_type_feature_tag">
                                                            <FaCrown />
                                                        </span>
                                                    </div>
                                                    <div className="listing_card_body">
                                                        <span className="listing_prop_title">{elem?.title}</span>
                                                        <span className="listing_prop_loc">
                                                            {elem?.city} {elem?.state} {elem?.country}
                                                        </span>
                                                        <span className="listing_prop_pirce">
                                                            {formatPriceAbbreviated(elem?.price)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell align="center">
                                                {elem?.advertisement_status === 0 ? (
                                                    <span className="active_status">{translate("approved")}</span>
                                                ) : elem?.advertisement_status === 1 ? (
                                                    <span className="panding_status">{translate("pending")}</span>
                                                ) : elem?.advertisement_status === 2 ? (
                                                    <span className="inactive_status">{translate("rejected")}</span>
                                                ): elem?.advertisement_status === 3 ? (
                                                    <span className="inactive_status">{translate("expired")}</span>
                                                ):null}
                                            </TableCell>
                                            {/* <TableCell align="center">{elem?.advertisement_type}</TableCell> */}
                                            <TableCell align="center">
                                                <Dropdown
                                                    visible={anchorEl === index}
                                                    onVisibleChange={(visible) => {
                                                        if (visible) {
                                                            setAnchorEl(index);
                                                        } else {
                                                            setAnchorEl(null);
                                                        }
                                                    }}
                                                    overlay={
                                                        <Menu>
                                                            <Menu.Item key="view" onClick={() => handleView(elem.slug_id)}>
                                                                <Button type="text" icon={<RemoveRedEyeIcon />}>
                                                                    {translate("view")}
                                                                </Button>
                                                            </Menu.Item>


                                                            {elem?.advertisement_status === 1 &&
                                                                <Menu.Item key="delete" onClick={() => handleClickDelete(elem.advertisement_id)}>
                                                                    <Button type="text" icon={<DeleteOutlined />} >
                                                                        {translate("delete")}
                                                                    </Button>
                                                                </Menu.Item>
                                                            }
                                                        </Menu>
                                                    }
                                                >
                                                    <Button id="simple-menu">
                                                        <BsThreeDotsVertical />
                                                    </Button>
                                                </Dropdown>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">
                                            <p>{translate("noDataAvailabe")}</p>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {total > limit ? (
                        <div className="col-12">
                            <ReactPagination pageCount={Math.ceil(total / limit)} onPageChange={handlePageChange} />
                        </div>
                    ) : null}
                </div>
            </div>
        </VerticleLayout>
    );
};

export default withAuth(UserAdvertisement);
