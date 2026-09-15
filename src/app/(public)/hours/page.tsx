"use client";

import Layout from "../../../components/layout/Layout";
import "../../styles/hours.css";

export default function Hours() {
    return (
        <Layout parent="Home" sub="Hours">
            <div className="page-content pt-50 pb-80">
                <div className="container">

                    <div className="hours-wrapper">
                        <table className="hours-table">

                            <thead>
                                <tr>
                                    <th>Month</th>
                                    <th>Monday</th>
                                    <th>Tuesday</th>
                                    <th>Wednesday</th>
                                    <th>Thursday</th>
                                    <th>Friday</th>
                                    <th>Saturday</th>
                                    <th>Sunday</th>
                                </tr>
                            </thead>

                            <tbody>

                                <tr>
                                    <td>January</td>
                                    <td colSpan={5} className="weekday">
                                        Closed
                                    </td>
                                    <td></td>
                                    <td></td>
                                </tr>

                                <tr>
                                    <td>February</td>
                                    <td colSpan={5} className="weekday">
                                        Closed
                                    </td>
                                    <td></td>
                                    <td></td>
                                </tr>

                                <tr>
                                    <td>March</td>
                                    <td colSpan={5} className="weekday">
                                        9am-5pm WEEKDAYS – Monday to Friday – weather permitting
                                    </td>
                                    <td>Closed</td>
                                    <td>Closed</td>
                                </tr>

                                <tr>
                                    <td>April</td>
                                    <td colSpan={5} className="weekday">
                                        8am-6pm WEEKDAYS – Monday to Friday – weather permitting
                                    </td>
                                    <td>8am-6pm</td>
                                    <td>9am-5pm</td>
                                </tr>

                                <tr>
                                    <td>May</td>
                                    <td colSpan={5} className="weekday">
                                        8am-6pm WEEKDAYS – Monday to Friday – Holidays 9am-5pm
                                    </td>
                                    <td>8am-6pm</td>
                                    <td>9am-5pm</td>
                                </tr>

                                <tr>
                                    <td>June</td>
                                    <td colSpan={5} className="weekday">
                                        8am-7pm WEEKDAYS – Monday to Friday – Holidays 9am-5pm
                                    </td>
                                    <td>8am-6pm</td>
                                    <td>9am-5pm</td>
                                </tr>

                                <tr>
                                    <td>July</td>
                                    <td colSpan={5} className="weekday">
                                        8am-6pm WEEKDAYS – Monday to Friday – Holidays 9am-5pm
                                    </td>
                                    <td>8am-6pm</td>
                                    <td>9am-5pm</td>
                                </tr>

                                <tr>
                                    <td>August</td>
                                    <td colSpan={5} className="weekday">
                                        8am-6pm WEEKDAYS – Monday to Friday – Holidays 9am-5pm
                                    </td>
                                    <td>8am-6pm</td>
                                    <td>9am-5pm</td>
                                </tr>

                                <tr>
                                    <td>September</td>
                                    <td colSpan={5} className="weekday">
                                        8am-6pm WEEKDAYS – Monday to Friday – Holidays 9am-5pm
                                    </td>
                                    <td>8am-6pm</td>
                                    <td>9am-5pm</td>
                                </tr>

                                <tr>
                                    <td>October</td>
                                    <td colSpan={5} className="weekday">
                                        8am-6pm WEEKDAYS – Monday to Friday – Holidays 9am-5pm
                                    </td>
                                    <td>8am-6pm</td>
                                    <td>9am-5pm</td>
                                </tr>

                                <tr>
                                    <td>November</td>
                                    <td colSpan={5} className="weekday">
                                        8am-5pm WEEKDAYS – Monday to Friday – Holidays 9am-5pm
                                    </td>
                                    <td>8am-5pm</td>
                                    <td>9am-5pm</td>
                                </tr>

                                <tr>
                                    <td>December</td>
                                    <td colSpan={5} className="weekday">
                                        9am-5pm WEEKDAYS – Monday to Friday – Holidays 9am-5pm
                                    </td>
                                    <td>9am-5pm</td>
                                    <td>9am-5pm</td>
                                </tr>

                            </tbody>

                        </table>
                    </div>

                </div>
            </div>
        </Layout>
    );
}