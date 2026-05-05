package damas;

import java.io.InputStream;

import javafx.scene.control.Button;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Pane;
import javafx.scene.layout.StackPane;
import javafx.scene.paint.Color;
import javafx.scene.text.Font;
import javafx.scene.text.Text;

public class General_buttons extends Button
{
	General_buttons(Pane pane, String text, Image default_img, Image hover_img, double custom_width, double custom_height) //menu
	{
		//añade los botones al panel
				pane.getChildren().add(this);
				//pone los botones al tamaño por defecto del panel
				this.setMinSize(pane.getPrefWidth(), pane.getPrefHeight());
				     
		        this.getStyleClass().add("Buttons");
		        
		        //Cargar la fuente personalizada
		        InputStream fontStream = getClass().getResourceAsStream("/resources/fonts/SourceCode.otf");
		        Font fuentePersonalizada = Font.loadFont(fontStream, 30);

		        //Crear texto del botón con la fuente personalizada y color negro
		        Text texto_boton = new Text(text);
		        texto_boton.setFont(fuentePersonalizada);
		        texto_boton.setFill(Color.BLACK);

		        //Cargar la imagen predeterminada
		       
		        ImageView defaultImageView = new ImageView(default_img);
		        defaultImageView.setPreserveRatio(true);
		        defaultImageView.setFitWidth(custom_width); // Ajustar el ancho según sea necesario
		        defaultImageView.setFitHeight(custom_height);
		        
		        //Cargar la imagen al pasar el cursor
		        
		        ImageView hoverImageView = new ImageView(hover_img);
		        hoverImageView.setPreserveRatio(true);
		        hoverImageView.setFitWidth(custom_width);
		        hoverImageView.setFitHeight(custom_height);
		        
		        StackPane stackPane = new StackPane();
		        stackPane.getChildren().addAll(defaultImageView, texto_boton);
		        StackPane.setAlignment(texto_boton, javafx.geometry.Pos.CENTER);
		        
		        this.setGraphic(stackPane);
		        //Establecer el texto y la imagen predeterminada como el contenido del botón
		        

		        //Manejar el evento de pasar el cursor por encima del botón
		        this.setOnMouseEntered(event -> {

		        	this.setGraphic(new StackPane(hoverImageView, texto_boton));
		        });

		        //Manejar el evento de retirar el cursor del botón
		        this.setOnMouseExited(event -> {

		        	this.setGraphic(new StackPane(defaultImageView, texto_boton));
		        });
	}
}
