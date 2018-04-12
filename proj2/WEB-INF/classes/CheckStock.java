import java.io.*;
import java.text.*;
import java.util.*;
import javax.servlet.*;
import javax.servlet.http.*;

import sdsu.*;


public class CheckStock extends HttpServlet {
	
	Vector<String[]> resultSet;
	String output;
    
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {   
	    
		response.setContentType("text/html");
	    PrintWriter out = response.getWriter();
		resultSet = new Vector<String[]>();
		output = "";
		String sku = request.getParameter("sku");
		String qty = request.getParameter("qty");
	    String query = "SELECT sku, quantity FROM products WHERE sku = '"+ sku +"';";
		resultSet = DBHelper.runQuery(query);
		output = resultSet.get(0)[0] + "|" + resultSet.get(0)[1] + "|" + qty;
		
	    out.print(output);
    }  
}