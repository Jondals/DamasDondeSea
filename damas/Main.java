package damas;

import java.nio.file.Paths;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.application.Application;
import javafx.beans.value.ChangeListener;
import javafx.beans.value.ObservableValue;
import javafx.event.EventHandler;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Node;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.Slider;
import javafx.scene.control.TextArea;
import javafx.scene.input.KeyCode;
import javafx.scene.input.KeyEvent;
import javafx.scene.input.MouseButton;
import javafx.scene.input.MouseEvent;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.GridPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Pane;
import javafx.scene.layout.Priority;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;
import javafx.scene.media.AudioClip;
import javafx.scene.media.Media;
import javafx.scene.media.MediaPlayer;
import javafx.stage.Stage;

public class Main extends Application
{	
	final static Scene sc = new Scene(new Pane()); //const para que puedan acceder todos los metodos y clases
	final static Image button_default = new Image("/resources/buttons/18.png");
	final static Image button_onclic = new Image("/resources/buttons/19.png");
	final static Image button_info = new Image("/resources/buttons/15.png");
	final static Image button_infoclic = new Image("/resources/buttons/14.png");
	final static Image button_options = new Image("/resources/buttons/16.png");
	final static Image button_optionsclic = new Image("/resources/buttons/13.png");
	final static Image forest = new Image("/resources/images/bosque.png");
	final static Image lake = new Image("/resources/images/lago.png");
	final static Image mountine = new Image("/resources/images/montaña.png");
	final static Image forestonclic = new Image("/resources/images/bosque_onclic.png");
	final static Image lakeonclic = new Image("/resources/images/lago_onclic.png");
	final static Image mountineonclic = new Image("/resources/images/montaña_onclic.png");
	final static Image forest_text = new Image("/resources/images/bosque_text.png");
	final static Image lake_text = new Image("/resources/images/lago_text.png");
	final static Image mountine_text = new Image("/resources/images/montaña_text.png");
	
	static boolean primerBotonPresionado = false;
    static Button botonprimero;
    static int x;
	static int y;
	static int xfinal;
	static int yfinal;
	static int turno;
	
	public void start(Stage primaryStage) 
	{		
		sc.getStylesheets().add(getClass().getResource("Style.css").toExternalForm());
		
		primaryStage.setMinWidth(1016);
		primaryStage.setMinHeight(750);
		primaryStage.setFullScreenExitHint(""); 
		primaryStage.setFullScreen(true);
		primaryStage.setTitle("Damas");
		primaryStage.setScene(sc);
		primaryStage.show();
		
		
		//test();  
	    sc_menu(primaryStage);
	}
	
	public static void sc_menu(Stage primaryStage) 
	{
		BorderPane menu = new BorderPane();
		Menu_container vbox_menu = new Menu_container();
		Menu_container options_vbox = new Menu_container();
		Menu_container info_vbox = new Menu_container();
		Pane pane = new Pane();
		HBox hbox = new HBox();
        
		menu.setId("menu");
		menu.setBottom(vbox_menu); //generales
		menu.setTop(hbox); //laterales
		
		
		Media media = new Media(Paths.get("./src/resources/sound/song_menu.wav").toUri().toString());
		AudioClip mediaPlayer = new AudioClip(media.getSource());
		mediaPlayer.setCycleCount(MediaPlayer.INDEFINITE);
        mediaPlayer.play();
		
		
		generalEvents(primaryStage);
		event_menu(primaryStage, menu, vbox_menu, options_vbox, hbox, pane, info_vbox, mediaPlayer);
		sc.setRoot(menu);
	}
	
	public static void event_menu(Stage primaryStage, BorderPane menu, VBox vbox, VBox options_vbox ,HBox hbox, Pane pane, VBox info_vbox, AudioClip mediaPlayer) 
	{
		Image title = new Image("/resources/images/title.png");
		ImageView imageview = new ImageView(title);
		
		imageview.setPreserveRatio(true);
		imageview.setFitWidth(750);
		BorderPane.setAlignment(imageview, Pos.CENTER);
		
		Slider slider = new Slider(0, 1, 0.5); //vmin, vmax, vinic
		slider.setShowTickLabels(true);
		slider.setShowTickMarks(true);
		slider.setMaxHeight(50);
        slider.setMaxWidth(200);
		
        options_vbox.getChildren().add(slider);
        
		General_buttons jugar = new General_buttons(vbox, "Jugar", button_default, button_onclic, 200, 200);
		General_buttons cargar = new General_buttons(vbox, "Cargar", button_default, button_onclic, 200, 200);
		General_buttons opciones = new General_buttons(hbox, "", button_options, button_optionsclic, 100, 100);
		General_buttons salir = new General_buttons(vbox, "Salir", button_default, button_onclic, 200, 200);
		General_buttons fullscreen = new General_buttons(options_vbox, "Pantalla Completa", button_default, button_onclic, 260, 350);
		General_buttons windowed = new General_buttons(options_vbox, "Ventana", button_default, button_onclic, 200, 200);
		General_buttons volver_opciones = new General_buttons(options_vbox, "Volver", button_default, button_onclic, 200, 200);
		General_buttons volver_info = new General_buttons(options_vbox, "Volver", button_default, button_onclic, 200, 200);
		ImageView info_bg = new ImageView(new Image("/resources/images/info_bg.png"));
		
		info_bg.setPreserveRatio(true);
		info_bg.fitHeightProperty().bind(primaryStage.heightProperty().subtract(500));
		info_bg.fitWidthProperty().bind(primaryStage.widthProperty().subtract(600));
		
		info_vbox.getChildren().addAll(info_bg, volver_info);
		
		hbox.getChildren().add(pane);
		General_buttons info = new General_buttons(hbox, "", button_info, button_infoclic, 100, 100);
		HBox.setHgrow(pane, Priority.ALWAYS);
		
		menu.setCenter(imageview);
		
		Options_vbox vbox_options = new Options_vbox(primaryStage, options_vbox);
		
		jugar.setOnMouseClicked((MouseEvent mouseEvent) -> {
			if(mouseEvent.getButton() == MouseButton.PRIMARY) 
			{
				sc_choose(primaryStage, menu);
			}
		});
		
		salir.setOnMouseClicked((MouseEvent mouseEvent) -> {
			if(mouseEvent.getButton() == MouseButton.PRIMARY) 
			{
				primaryStage.close();
			}
		});
		
		opciones.setOnMouseClicked((MouseEvent mouseEvent) -> {
			if(mouseEvent.getButton() == MouseButton.PRIMARY) 
			{
				menu.setBottom(vbox_options);
			}
		});
		
		info.setOnMouseClicked((MouseEvent mouseEvent) -> {
			if(mouseEvent.getButton() == MouseButton.PRIMARY) 
			{
				menu.setBottom(info_vbox);
			}
		});
		
		fullscreen.setOnMouseClicked((MouseEvent mouseEvent) -> {
			if(mouseEvent.getButton() == MouseButton.PRIMARY) 
			{
				primaryStage.setFullScreenExitHint("");  //quitar mensaje
				primaryStage.setFullScreen(true);
			}
		});
		
		windowed.setOnMouseClicked((MouseEvent mouseEvent) -> {
			if(mouseEvent.getButton() == MouseButton.PRIMARY) 
			{
				primaryStage.setFullScreen(false);
			}
		});
		
		slider.valueProperty().addListener((observable, oldValue, newValue) -> {
            //Ajustar el volumen solo si el audio está reproduciéndose
            if (mediaPlayer.isPlaying()) {
                mediaPlayer.setVolume(newValue.doubleValue());
            }
        });
		volver_opciones.setOnMouseClicked((MouseEvent mouseEvent) -> {
			if(mouseEvent.getButton() == MouseButton.PRIMARY) 
			{
				menu.setBottom(vbox);
			}
		});
		
		volver_info.setOnMouseClicked((MouseEvent mouseEvent) -> {
			if(mouseEvent.getButton() == MouseButton.PRIMARY) 
			{
				menu.setBottom(vbox);
			}
		});
	}
	
	public static void sc_choose(Stage primaryStage, BorderPane menu) 
	{
		BorderPane choose = new BorderPane(); //general
		HBox choose_hbox = new HBox();
		HBox back_button = new HBox(); //botones
		Image title = new Image("/resources/images/sitio.png"); //title
		ImageView imageview = new ImageView(title);
		BorderPane.setAlignment(imageview, Pos.TOP_CENTER);
		
		imageview.setPreserveRatio(true);
		imageview.setFitWidth(1000);
		
		choose.setId("choose");
		choose.setTop(imageview);
		choose.setCenter(choose_hbox);
		choose.setBottom(back_button);
		
		choose_hbox.setAlignment(Pos.CENTER);
		back_button.setAlignment(Pos.CENTER);
		
		choose_events(primaryStage, choose_hbox, back_button, menu);
		sc.setRoot(choose);
	}
	
	
	public static void choose_events(Stage primaryStage, HBox choose_hbox, HBox back_button, BorderPane menu) 
	{		
		General_buttons bosque = new General_buttons(choose_hbox, "", forest, forestonclic, 200, 200);
		General_buttons lago = new General_buttons(choose_hbox, "", lake, lakeonclic, 200, 200);
		General_buttons montaña = new General_buttons(choose_hbox, "", mountine, mountineonclic, 200, 200);
		General_buttons volver = new General_buttons(back_button, "Volver", button_default, button_onclic, 200, 200);
		
		ImageView bosqueImage = new ImageView(forest_text);
	    ImageView lagoImage = new ImageView(lake_text);
	    ImageView montañaImage = new ImageView(mountine_text);
		
		// Agregar las imágenes a VBox junto con los espacios correspondientes
	    VBox bosqueVBox = new VBox(bosque, bosqueImage);
	    VBox lagoVBox = new VBox(lago, lagoImage);
	    VBox montañaVBox = new VBox(montaña, montañaImage);

	    // Alinear el contenido del VBox al centro
	    bosqueVBox.setAlignment(Pos.CENTER);
	    lagoVBox.setAlignment(Pos.CENTER);
	    montañaVBox.setAlignment(Pos.CENTER);
	    
	    bosqueImage.setPreserveRatio(true);
	    lagoImage.setPreserveRatio(true);
	    montañaImage.setPreserveRatio(true);
	    bosqueImage.setFitWidth(200);
	    bosqueImage.setFitHeight(200);
	    lagoImage.setFitWidth(160);
	    lagoImage.setFitHeight(160);
	    montañaImage.setFitWidth(190);
	    montañaImage.setFitHeight(190);
	    
	    choose_hbox.getChildren().addAll(bosqueVBox, lagoVBox, montañaVBox);
	    
	    
		bosque.setOnMouseClicked((MouseEvent mouseEvent) -> {
			if(mouseEvent.getButton() == MouseButton.PRIMARY) 
			{
			    sc_juego(primaryStage, menu);
			}
		});
		
		volver.setOnMouseClicked((MouseEvent mouseEvent) -> {
			if(mouseEvent.getButton() == MouseButton.PRIMARY) 
			{
				sc.setRoot(menu);
			}
		});
		
	}
	
	public static void sc_juego(Stage primaryStage, BorderPane menu) 
	{
		BorderPane juego = new BorderPane();
		StackPane panel = new StackPane();
		GridPane tablero = new GridPane();
		Image tablero_img = new Image("/resources/images/tablero.png");
		ImageView imageview = new ImageView(tablero_img);
		HBox juego_hbox = new HBox();
		
		juego.setCenter(panel);
		juego.setBottom(juego_hbox);
		
		imageview.fitHeightProperty().bind(primaryStage.heightProperty().subtract(300));
		imageview.fitWidthProperty().bind(primaryStage.heightProperty().subtract(300));

		tablero.maxHeightProperty().bind(primaryStage.heightProperty().subtract(300));
		tablero.maxWidthProperty().bind(primaryStage.widthProperty().subtract(300));
		tablero.setPadding(new Insets(10)); //padding para el borde del tablero
		
		panel.getChildren().addAll(imageview, tablero);
		panel.setMaxWidth(imageview.getFitWidth());
		panel.setMaxHeight(imageview.getFitHeight());
		
		turno = 0;
		
		for(int j = 0; j < 8; j++) 
		{
		    for(int i = 0; i < 8; i++) 
		    {
		    	Button boton = new Button();
		    	
				boton.prefHeightProperty().bind(imageview.fitHeightProperty().divide(8));
				boton.prefWidthProperty().bind(imageview.fitWidthProperty().divide(8));
				boton.setStyle("-fx-background-radius: 20;" + "-fx-background-color: transparent");
				
				if((i + j) % 2 == 1 && j < 3)
			 	{
					ImageView ficha_blanca = new ImageView (new Image("/resources/images/ficha_blanca.png"));
					
					ficha_blanca.setId("ficha_blanca");
					ficha_blanca.fitWidthProperty().bind(boton.widthProperty().divide(1.5));
					ficha_blanca.fitHeightProperty().bind(boton.heightProperty().divide(1.5));
					ficha_blanca.setPreserveRatio(true);
					boton.setGraphic(ficha_blanca);
                } 
				
				else if ((i + j) % 2 == 1 && j > 4)
                {
					ImageView ficha_roja = new ImageView (new Image("/resources/images/ficha_roja.png"));
					
					ficha_roja.setId("ficha_roja");
					ficha_roja.fitWidthProperty().bind(boton.widthProperty().divide(1.5));
					ficha_roja.fitHeightProperty().bind(boton.heightProperty().divide(1.5));
					ficha_roja.setPreserveRatio(true);
					boton.setGraphic(ficha_roja);
                }
				
				//coordenadas iniciales
				boton.setOnMousePressed((MouseEvent event) -> 
				{
				    if (!primerBotonPresionado) 
				    {
				        Node botoninicial = (Node) event.getSource();  
				        x = GridPane.getRowIndex(botoninicial);
				        y = GridPane.getColumnIndex(botoninicial);

				        if (boton.getGraphic() != null) 
				        {
				        	String id = ((ImageView) boton.getGraphic()).getId(); 
				            System.out.println("Origen: (" + x + ", " + y + ") ID: " + id);
				            
				            primerBotonPresionado = true;
				            botonprimero = boton;
				        }
				    }
				    
				    else //coordenadas finales + movimiento
				    {
				        Node botonfinal = (Node) event.getTarget(); //boton al que se quiere mover
				        xfinal = GridPane.getRowIndex(botonfinal); 
				        yfinal = GridPane.getColumnIndex(botonfinal); //coordenadas finales
				        
				        if (boton.getGraphic() != null) 
				        {
				        	String id = ((ImageView) boton.getGraphic()).getId(); 
				            System.out.println("Destino: (" + xfinal + ", " + yfinal + ") ID: " + id);
				        }
				        else if(boton.getGraphic() == null) 
				        {
				        	System.out.println("Destino: (" + xfinal + ", " + yfinal+ ")");
				        	String id = null;
				        	
				        	if(Pieza.esMovimientoValido(x, y, xfinal, yfinal, id)) //comprobacion si es un movimiento valido
				        	{
				        		if(Pieza.movimiento(x, y, xfinal, yfinal, botonprimero, turno)) //depende de la ficha mueve al sitio
				        		{
				        			boton.setGraphic(botonprimero.getGraphic());
					        		botonprimero.setGraphic(null);
					        		turno++;
					        		System.out.println("Turno: " + turno);
				        		}
				        		else 
				        		{
				        			System.out.println("No puede mover");
				        		}
				        	}
				        }

				        primerBotonPresionado = false;
				    }
				});
				
				tablero.add(boton, i, j);
		    }
		}
		
		juego_events(primaryStage, juego, juego_hbox, menu);
		juego.setId("juego");
		sc.setRoot(juego);
	}
	
	public static void juego_events(Stage primaryStage, BorderPane juego, HBox juego_hbox, BorderPane menu) 
	{
		General_buttons volver = new General_buttons(juego_hbox, "Volver", button_default, button_onclic, 200, 200);
		
		volver.setOnMouseClicked((MouseEvent mouseEvent) -> 
		{
			if(mouseEvent.getButton() == MouseButton.PRIMARY) 
			{
				sc.setRoot(menu);
			}
		});
	}
	
	public static void generalEvents(Stage primaryStage)
	{
		 sc.setOnKeyPressed(new EventHandler <KeyEvent>()  
		 {
	            public void handle(KeyEvent event) 
	            {
	                if (event.getCode() == KeyCode.F11 && !primaryStage.isFullScreen()) 
	                {
	                    primaryStage.setFullScreen(true);
	                }
	                else 
	                {
	                	primaryStage.setFullScreen(false);
	                }
	            }
	        });
		 primaryStage.show();
	}
	
	public static void main(String[] args) 
	{
		launch(args);
	}
		
	public void test()
	{
		sc.widthProperty().addListener(new ChangeListener<Number>() {
	         
            public void changed(ObservableValue<? extends Number> observable, Number oldValue, Number newValue) {
                System.out.println("Ancho: " + newValue);
            }
        });

        sc.heightProperty().addListener(new ChangeListener<Number>() {
           
            public void changed(ObservableValue<? extends Number> observable, Number oldValue, Number newValue) {
                System.out.println("Alto: " + newValue);
            }
        });
	}
}