import java.io.*;
import java.text.*;
import java.util.*;
import javax.servlet.*;
import javax.servlet.http.*;

import sdsu.*;


public class GetFilteredProducts extends HttpServlet {
	
	Vector<String[]> resultSet;
	String output;
    
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {   
	    
		response.setContentType("text/html");
	    PrintWriter out = response.getWriter();
		resultSet = new Vector<String[]>();
		output = "";
		
	    String description = request.getParameter("description");
		String features = request.getParameter("description");
		String category = request.getParameter("category");
		String vendor = request.getParameter("vendor");
		String priceMin = request.getParameter("priceMin");
		String priceMax = request.getParameter("priceMax");
		String availability = request.getParameter("availability");
		
		String query = "SELECT sku, category, vendor, mfg_id, description, features, cost, retail, quantity, image FROM products "
					 + "WHERE retail BETWEEN " + priceMin + " AND " + priceMax;
		
		if(!description.isEmpty()) {
			description = "'%" + description + "%'";
			features = "'%" + features + "%'";
			query += " AND (description LIKE " + description + " OR features LIKE " + features + ")";
		}
		
		if(!category.isEmpty())
			query += " AND category=" + category;
		
		if(!vendor.isEmpty())
			query += " AND vendor=" + vendor;
		
		if(!availability.isEmpty()) {
			if(availability.equals("In Stock"))
				query += " AND quantity > 0";
			else if(availability.equals("Coming Soon"))
				query += " AND quantity = 0";
		}
		
		query += ";";
			
		resultSet = DBHelper.runQuery(query);
		for(int i = 0; i < resultSet.size(); i++) {
			for(int j = 0; j < resultSet.get(i).length; j++) {
				if(j != resultSet.get(i).length-1)
					output += resultSet.get(i)[j] + "|";
				else
					output += resultSet.get(i)[j];
			}
			if(i != resultSet.size()-1)
				output += "^";
		}

	    out.print(output);
    }  
}