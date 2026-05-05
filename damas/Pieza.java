package damas;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import javafx.collections.ObservableList;
import javafx.scene.Node;
import javafx.scene.control.Button;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.GridPane;

public class Pieza 
{
	public static int x;
	public static int y;
	public static int xfinal;
	public static int yfinal;
	public static String id;
	public static boolean puedeMover;
	
	public Pieza(int x, int y, int xfinal, int yfinal, String id) 
	{
        this.x = x;
        this.y = y;
        this.xfinal = xfinal;
        this.yfinal = yfinal;
        this.id = id;
    }
	
	public Pieza(Button primerBoton, Node botonfinal, String id) 
	{
		
        this.x = GridPane.getRowIndex(primerBoton);
        this.y = GridPane.getColumnIndex(primerBoton);
        
        this.xfinal = GridPane.getRowIndex(botonfinal);
        this.yfinal = GridPane.getColumnIndex(botonfinal);
        
        this.id = id;
    }
	public boolean esTuFicha(String idJugador) 
	{
	    return this.id.equals(idJugador);
	}
	
	public static boolean esMovimientoValido(int x, int y, int xfinal, int yfinal, String id) 
	{
	    if(((yfinal == y + 1 && xfinal == x + 1) || (yfinal == y - 1 && xfinal == x + 1) || (yfinal == y - 1 && xfinal == x - 1) || (yfinal == y + 1 && xfinal == x - 1)))
	    {
	    	if(id == null) 
	    	{
	    		return true;
	    	}
	    	
	    }
		return false;
	}
	
	public static boolean movimiento(int x, int y, int xfinal, int yfinal, Button botonprimero, int turno) 
	{
		String id = ((ImageView) botonprimero.getGraphic()).getId();
		
		if(id.equals("ficha_roja") && turno % 2 == 0) 
		{
			if ((yfinal == y - 1 && xfinal == x - 1) || (yfinal == y + 1 && xfinal == x - 1)) 
			{
	            return true;
	        }
			
		}
		else if(id.equals("ficha_blanca") && turno % 2 != 0)
		{
			if ((yfinal == y + 1 && xfinal == x + 1) || (yfinal == y - 1 && xfinal == x + 1)) 
			{
	            return true;
	        }
		}
		return false;
	}
	
}	
	/*
	
	public boolean comer(int x, int y, int xfinal, int yfinal, Tablero_funciones tablero) 
	{
		int xft = xfinal;
		int yft = yfinal;
		
		if((tablero.get(x, y)) xfinal != 0 && xfinal != 7 && !(tablero.get(xfinal, yfinal).equals(null))) //no puede ser ni 0 ni 7 porque se sale de la matriz (borde)
		{
			if(tablero.get(x, y).equals(fj1)) 
			{
				if(x - xft > 0 && y - yft > 0 ) //arriba izquierda
				{
					xft--;
					yft--;
					
					if(tablero.get(xft, yft) == null) 
					{
						return true;
					}
				}
				else if(x - xft > 0 && y - yft < 0)  //arriba derecha
				{
					xft--;
					yft++;
					
					if(tablero.get(xft, yft) == null) 
					{
						return true;
					}
				}
				else 
				{
					//System.out.println("No come fichan");
					puedeMover = false;
					return false;
				}
			}
			
			else if(tablero.get(x, y).equals(fj2)) 
			{
				if(x - xft < 0 && y - yft > 0) //abajo izquierda
				{	
					xft++;
					yft--;
					
					if(tablero.get(xft, yft) == null) 
					{
						return true;
					}
				}
				else if(x - xft < 0 && y - yft < 0)  //abajo derecha
				{
					xft++;
					yft++;
					
					if(tablero.get(xft, yft) == null) 
					{
						return true;
					}
				}
				else 
				{
					//System.out.println("No come fichab");
					puedeMover = false;
					return false;
				}
			}
			
			else if(tablero.get(x, y).equals(fj1) || tablero.get(x, y).equals(fj2)) 
			{
				if(x - xft > 0 && y - yft > 0 ) //arriba izquierda
				{
					xft--;
					yft--;
					
					if(tablero.get(xft, yft) == null) 
					{
						return true;
					}
				}
				
				else if(x - xft > 0 && y - yft < 0)  //arriba derecha
				{
					xft--;
					yft++;
					
					if(tablero.get(xft, yft) == null) 
					{
						return true;
					}
				}
				
				else if(x - xft < 0 && y - yft > 0) //abajo izquierda
				{	
					xft++;
					yft--;
					
					if(tablero.get(xft, yft) == null) 
					{
						return true;
					}
				}
				
				else if(x - xft < 0 && y - yft < 0)  //abajo derecha
				{
					xft++;
					yft++;
					
					if(tablero.get(xft, yft) == null) 
					{
						return true;
					}
				}
				else 
				{
					//System.out.println("No come dama");
					puedeMover = false;
					return false;
				}
			}
			
			else 
			{
				//System.out.println("No come ");
				puedeMover = false;
				return false;
			}
		}
		else if((tablero.get(xfinal, yfinal) == tablero.get(xfinal, yfinal)))
		{
			//System.out.println("No come (Es una pieza igual)");
			puedeMover = false;
			return false;
		}
		return false;
	}
	
	public void movimiento(int x, int y, int xfinal, int yfinal, Tablero_funciones tablero) 
	{
		//boolean comer = comer(x, y, xfinal, yfinal);
		
		if((tablero.get(x, y) == Globales.DAMAJ2) && ((yfinal == y + 1 && xfinal == x + 1) || (yfinal == y - 1 && xfinal == x + 1) || (yfinal == y - 1 && xfinal == x - 1) || (yfinal == y + 1 && xfinal == x - 1))) 
		{
			if(esTuFicha(id) && comer == false && (Tablero.tableroArray[xfinal][yfinal].id == Globales.VACIO))//posibilidad en un espacio vacio
			{
				Tablero.tableroArray[xfinal][yfinal] = new DamaB(xfinal, yfinal);
				Tablero.tableroArray[x][y] = new Vacio(x, y);
				puedeMover = true;
			}
			
			else if(comer)
			{
				Tablero.tableroArray[xfinal][yfinal] = new Vacio(xfinal, yfinal);
				
				if(yfinal == y - 1 && xfinal == x - 1) 
				{
					xfinal--;
					yfinal--;
				}
				else if(yfinal == y - 1 && xfinal == x + 1)
				{
					xfinal++;
					yfinal--;
				} 
				
				else if(xfinal == x + 1 && yfinal == y + 1) 
				{
					xfinal++;
					yfinal++;
				
				}
				else if(xfinal == x - 1 && yfinal == y + 1)
				{
					xfinal--;
					yfinal++;
				} 
				
				Tablero.tableroArray[x][y] = new Vacio(x, y);
				Tablero.tableroArray[xfinal][yfinal] = new DamaB(xfinal, yfinal);
				puedeMover = true;
			}
			else
			{
				puedeMover = false;
				//System.out.println("1No se puede realizar el movimiento (dama b)");
			}	
		}
		else 
		{
			puedeMover = false;
			//System.out.print("2No se puede realizar el movimiento (dama b)");
		}
	}
	
	
	public boolean comprobarMovimiento(int x, int y, int xfinal, int yfinal) 
	{
		try
		{
			comer = comer(x, y, xfinal, yfinal);
		}
		catch(java.lang.ArrayIndexOutOfBoundsException e) 
		{
			//System.out.print("No puedes comer ahi\n");
		}
		
		if(((yfinal == y + 1 && xfinal == x + 1) || (yfinal == y - 1 && xfinal == x + 1) || (yfinal == y - 1 && xfinal == x - 1) || (yfinal == y + 1 && xfinal == x - 1))) //movimiento ficha
		{
			if(!comer && (Tablero.tableroArray[xfinal][yfinal].id == Globales.VACIO && esTuFicha(id) && xfinal == x + 1)) // posibilidad cuando hay un espacio vacio
			{
				return true;
			}
				
			else if(comer && esTuFicha(id)) 
			{
				return true;
			}
			else 
			{
				return false;
			}
		}
		else 
		{
			return false;
		}
	}
	
	public static void nfichas(GridPane tablero) //cuenta las fichas y damas que hay en el tablero
	{
		//System.out.print("\nFichas player: " + ficha + " " + dama);
		int contador = 0;

		for(int i = 0; i<tableroArray.length; i++) 
		{
			for(int j = 0; j<tableroArray[i].length; j++) 
			{
				if((tableroArray[i][j].simbolo != ficha && tableroArray[i][j].simbolo != dama) && tableroArray[i][j].simbolo != Globales.VACIO) //no es tu ficha no es tu dama y no es vacio = fichas contrarias
				{
					contador++;	
				}
			}
		}
		return contador;
	}
	
	public static boolean comprobarXY(int xy int xpieza, int ypieza, String id) //si encuentra x e y igual a los supuestos de pintarAyudaMovimiento devuelve true
	{
		ArrayList<int[]> nueva = new ArrayList<int[]>();
		nueva = pintarAyudaMovimiento(xpieza, ypieza, id);
		
		for(int i = 0; i<nueva.size(); i++) //for necesario porque no siempre hay 2 coordenadas
		{
			if((nueva.get(i)[0] == x && nueva.get(i)[1] == y)) 
			{
				return true;
			}
		}
				
		return false;
	}
	
	public static ArrayList<int []> pintarAyudaMovimiento(int x, int y, String simbolo) //comprueba movimientos posibles
	{
		int [] xsupuesto = {x - 1, x - 1, x + 1, x + 1}; //posibles movimientos en x
		int [] ysupuesto = {y + 1, y - 1, y + 1, y - 1}; //posibles movimientos en y
		
		ArrayList<int []> general = new ArrayList<int []>();
		
		for(int i = 0; i<4; i++)  
		{
			if((xsupuesto[i] <= 7 && xsupuesto[i] >= 0) && (ysupuesto[i] <= 7 && ysupuesto[i] >= 0)) 
			{
				if(tableroArray[x][y].comprobarMovimiento(x, y, xsupuesto[i], ysupuesto[i]))
				{
					general.add(new int [] {xsupuesto[i], ysupuesto[i]}); //Arraylist de arrays
				}
			}
		}
		
		return general;
	}
	
	public static boolean bloqueo() //comprueba si hay bloqueo con comprobarXY
	{
		String simbolo;
		
		for(int i = 0; i < FILA; i++) 
		{
			for(int j = 0; j < COLUMNA; j++) //recorre el array y elige la ficha
			{
				simbolo = tableroArray[i][j].simbolo;
				
				for(int k = 0; k < FILA; k++) 
				{
					for(int l = 0; l < COLUMNA; l++) //comprueba los movimientos
					{
						if(comprobarXY(i, j, k, l, simbolo)) 
						{
							return false;
						}
					}
				}
			}
		}
		return true;
	}

	public static void guardarPartida(String saveName, String save)
	{	
		try 
		{
			PrintWriter guardar = new PrintWriter(new FileWriter(saveName));
			guardar.print(save);
			guardar.close();
			System.out.println("\nPartida guardada.");
		}
		
		catch (FileNotFoundException e) 
		{
			e.printStackTrace();
		}
		
		catch (IOException e) 
		{
			e.printStackTrace();
		}
		
	}
	
	public static int cargarPartida(String saveName) throws FileNotFoundException //juega para cargar la partida donde se guardo
	{
		int x;
		int y;
		int xfinal;
		int yfinal;
		int turno = 0;
		int modelo_tablero = 0;
		
		String temp[];
		BufferedReader lectura = new BufferedReader(new FileReader(saveName));
		
		try 
		{
			String leer =  lectura.readLine(); 
			boolean rellenaPrimeraVez = true;
			
			while(leer != null) 
			{ 
				temp = leer.split(" ");
				
				x = Integer.parseInt(temp[0]);
				y = Integer.parseInt(temp[1]);
				xfinal = Integer.parseInt(temp[2]);
				yfinal = Integer.parseInt(temp[3]);
				turno = Integer.parseInt(temp[4]);
				modelo_tablero = Integer.parseInt(temp[5]);
				
				if(rellenaPrimeraVez) 
				{
					rellenarTablero(modelo_tablero);
					rellenaPrimeraVez = false;
				}
				
				tableroArray[x][y].movimiento(x, y, xfinal, yfinal);
				leer =  lectura.readLine();
				
			}
			
			lectura.close();
			return turno;
		
		}
		catch (IOException e) 
		{
			e.printStackTrace();
		}
		return turno;
	}
	
}
*/