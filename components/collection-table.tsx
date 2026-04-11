const DataTable = ({ className }: { className: string }) => {
    return (
        <div className={className}>
            <table border={1} className="dataframe">
                <thead>
                    <tr style={{ textAlign: 'right' }}>
                        <th></th>
                        <th>name</th>
                        <th>created_at</th>
                        <th>description</th>
                        <th>tags</th>
                        <th>status</th>
                        <th>submitted</th>
                        <th>E</th>
                        <th>L</th>
                        <th>N</th>
                        <th>amplitude</th>
                        <th>contrast</th>
                        <th>eps</th>
                        <th>kappa</th>
                        <th>maxiter</th>
                        <th>nu</th>
                        <th>r_soft</th>
                        <th>asperity_width</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>0</th>
                        <td>a7428463ab</td>
                        <td>2025-07-17 13:31:22.507583</td>
                        <td>contact area</td>
                        <td>[]</td>
                        <td>initialized</td>
                        <td>False</td>
                        <td>1</td>
                        <td>1</td>
                        <td>127</td>
                        <td>0.05</td>
                        <td>0.01</td>
                        <td>0.03</td>
                        <td>100</td>
                        <td>20</td>
                        <td>0.3</td>
                        <td>0.4</td>
                        <td>0.25</td>
                    </tr>
                    <tr>
                        <th>1</th>
                        <td>fc5add3cb1</td>
                        <td>2025-07-17 12:19:23.840253</td>
                        <td>contact area</td>
                        <td>[]</td>
                        <td>finished</td>
                        <td>False</td>
                        <td>1</td>
                        <td>1</td>
                        <td>127</td>
                        <td>0.05</td>
                        <td>0.01</td>
                        <td>0.03</td>
                        <td>100</td>
                        <td>20</td>
                        <td>0.3</td>
                        <td>0.4</td>
                        <td>0.25</td>
                    </tr>
                    <tr>
                        <th>2</th>
                        <td>a3249ecfcf</td>
                        <td>2025-07-17 12:01:20.553065</td>
                        <td>contact area</td>
                        <td>[]</td>
                        <td>finished</td>
                        <td>False</td>
                        <td>1</td>
                        <td>1</td>
                        <td>127</td>
                        <td>0.05</td>
                        <td>0.01</td>
                        <td>0.03</td>
                        <td>100</td>
                        <td>20</td>
                        <td>0.3</td>
                        <td>0.4</td>
                        <td>0.50</td>
                    </tr>
                    <tr>
                        <th>3</th>
                        <td>68689cd6aa</td>
                        <td>2025-07-17 11:16:02.597160</td>
                        <td>contact area</td>
                        <td>[]</td>
                        <td>finished</td>
                        <td>False</td>
                        <td>1</td>
                        <td>1</td>
                        <td>127</td>
                        <td>0.05</td>
                        <td>0.01</td>
                        <td>0.03</td>
                        <td>100</td>
                        <td>20</td>
                        <td>0.3</td>
                        <td>0.4</td>
                        <td>1.00</td>
                    </tr>
                    <tr>
                        <th>4</th>
                        <td>99c4a73da7</td>
                        <td>2025-07-17 10:44:28.160353</td>
                        <td>line search</td>
                        <td>[]</td>
                        <td>finished</td>
                        <td>False</td>
                        <td>1</td>
                        <td>1</td>
                        <td>200</td>
                        <td>0.05</td>
                        <td>0.01</td>
                        <td>0.03</td>
                        <td>200</td>
                        <td>20</td>
                        <td>0.3</td>
                        <td>0.4</td>
                        <td>NaN</td>
                    </tr>
                    <tr>
                        <th>5</th>
                        <td>0776a10b6f</td>
                        <td>2025-06-19 11:44:26.134032</td>
                        <td>line search</td>
                        <td>[]</td>
                        <td>finished</td>
                        <td>False</td>
                        <td>1</td>
                        <td>1</td>
                        <td>200</td>
                        <td>0.05</td>
                        <td>0.01</td>
                        <td>0.03</td>
                        <td>200</td>
                        <td>20</td>
                        <td>0.3</td>
                        <td>0.4</td>
                        <td>NaN</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;