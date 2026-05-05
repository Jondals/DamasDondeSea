package damas;

import javafx.geometry.Pos;
import javafx.scene.control.Slider;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;

public class Options_vbox extends StackPane {

    public Options_vbox(Stage primaryStage, VBox option_vbox) {
        super(); //constructor

        Image background = new Image("/resources/images/options_bg.png");
        ImageView backgroundView = new ImageView(background);
        backgroundView.setPreserveRatio(true);

        //reescalar fondo
        backgroundView.fitWidthProperty().bind(primaryStage.widthProperty().divide(2));
        backgroundView.fitHeightProperty().bind(primaryStage.heightProperty().divide(2));

        //orden
        StackPane.setAlignment(backgroundView, Pos.CENTER);
        StackPane.setAlignment(option_vbox, Pos.CENTER);

        //añadir fondo al vbox
        getChildren().addAll(backgroundView, option_vbox);
    }
}