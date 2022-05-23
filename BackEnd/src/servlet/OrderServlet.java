package servlet;

import javax.annotation.Resource;
import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObjectBuilder;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@WebServlet(urlPatterns = "/order")

public class OrderServlet extends HttpServlet {

    @Resource(name = "java:comp/env/jdbc/pool")
    DataSource dataSources;

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        JsonArrayBuilder arrayBuilder = Json.createArrayBuilder();
        JsonObjectBuilder objectBuilder = Json.createObjectBuilder();
        JsonObjectBuilder dataMsgBuilder = Json.createObjectBuilder();
        PrintWriter writer = resp.getWriter();
        Connection connection= null;
        try {
            connection = dataSources.getConnection();

            ResultSet rst;
            PreparedStatement pstm;
            String option = req.getParameter("option");
            switch (option){
                case "cmb_all_customer_Ids" :
                     rst = connection.prepareStatement("SELECT id FROM customer").executeQuery();
                     while (rst.next()){
                         String id = rst.getString(1);
                         objectBuilder.add("id", id);
                         arrayBuilder.add(objectBuilder.build());
                     }

                     dataMsgBuilder.add("data",arrayBuilder.build());
                     dataMsgBuilder.add("message" ,"Done");
                     dataMsgBuilder.add("status",200);
                     writer.print(dataMsgBuilder.build());
                     break;

                     case "cmb_all_item_Ids" :

                         rst = connection.prepareStatement("SELECT itemId FROM item").executeQuery();
                         while (rst.next()){
                             String id = rst.getString(1);
                             objectBuilder.add("itemId", id);
                             arrayBuilder.add(objectBuilder.build());
                         }

                         dataMsgBuilder.add("data",arrayBuilder.build());
                         dataMsgBuilder.add("message" ,"Done");
                         dataMsgBuilder.add("status",200);
                         writer.print(dataMsgBuilder.build());
                         break;

                case "selected_cus_data" :
                    String selectCusId = req.getParameter("selectCusId");
                    pstm=connection.prepareStatement("SELECT * FROM customer WHERE id=?");
                    pstm.setObject(1,selectCusId);
                    rst= pstm.executeQuery();
                    if (rst.next()){
                        String cusName = rst.getString(2);
                        String cusAddress = rst.getString(3);
                        String cusSalary = rst.getString(4);
                        objectBuilder.add("cusName",cusName);
                        objectBuilder.add("cusAddress",cusAddress);
                        objectBuilder.add("cusSalary",cusSalary);

                        arrayBuilder.add(objectBuilder.build());
                    }

                    dataMsgBuilder.add("data",arrayBuilder.build());
                    dataMsgBuilder.add("message" ,"Done");
                    dataMsgBuilder.add("status",200);
                    writer.print(dataMsgBuilder.build());
                    break;

                case "selected_item_data" :
                    String selectItemId = req.getParameter("selectItemId");
                    pstm=connection.prepareStatement("SELECT * FROM item WHERE itemId=?");
                    pstm.setObject(1,selectItemId);
                    rst= pstm.executeQuery();
                    if (rst.next()){
                        String itemName = rst.getString(2);
                        String itemAddress = rst.getString(3);
                        String itemSalary = rst.getString(4);
                        objectBuilder.add("itemName",itemName);
                        objectBuilder.add("itemAddress",itemAddress);
                        objectBuilder.add("itemSalary",itemSalary);

                        arrayBuilder.add(objectBuilder.build());
                    }

                    dataMsgBuilder.add("data",arrayBuilder.build());
                    dataMsgBuilder.add("message" ,"Done");
                    dataMsgBuilder.add("status",200);
                    writer.print(dataMsgBuilder.build());
                    break;
            }


        } catch (SQLException e) {
            dataMsgBuilder.add("data",e.getLocalizedMessage());
            dataMsgBuilder.add("message" ,"Error");
            dataMsgBuilder.add("status",400);
            writer.print(dataMsgBuilder.build());
            e.printStackTrace();
        }finally {
            try {
                connection.close();
            } catch (SQLException e) {

            }
        }
    }
}
