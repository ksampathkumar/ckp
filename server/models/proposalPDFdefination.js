let timestamp = new Date();

module.exports = {
    generateDocDef: function (req, prop) {

        let labsMap = new Map([

            ["gp-1", "2E - General Physics $$$ Introduction to Science"],
            ["gp-2", "2E - General Physics $$$ General Lab Safety"],
            ["gp-3", "2E - General Physics $$$ Measurements and Uncertainty"],
            ["gp-4", "2E - General Physics $$$ 1-D Kinematics"],
            ["gp-5", "2E - General Physics $$$ 2-D Kinematics and Projectile Motion"],
            ["gp-6", "2E - General Physics $$$ Newton’s Laws"],
            ["gp-7", "2E - General Physics $$$ Circular Motion"],
            ["gp-8", "2E - General Physics $$$ Gravity"],
            ["gp-9", "2E - General Physics $$$ Conservation of Energy"],
            ["gp-10", "2E - General Physics $$$ Conservation of Momentum"],
            ["gp-11", "2E - General Physics $$$ Torque and Static Equilibrium"],
            ["gp-12", "2E - General Physics $$$ Buoyant Force and Archimedes Principle"],
            ["gp-13", "2E - General Physics $$$ Simple Harmonic Motion"],
            ["gp-14", "2E - General Physics $$$ Properties of Waves"],
            ["gp-15", "2E - General Physics $$$ Ideal Gas Law"],
            ["gp-16", "2E - General Physics $$$ First Law of Thermodynamics"],
            ["gp-17", "2E - General Physics $$$ Second Law of Thermodynamics and Entropy"],
            ["gp-18", "2E - General Physics $$$ Electric Charge and Coulomb’s Law"],
            ["gp-19", "2E - General Physics $$$ Electric Field and Potential"],
            ["gp-20", "2E - General Physics $$$ Gauss’s Law"],
            ["gp-21", "2E - General Physics $$$ Capacitance"],
            ["gp-22", "2E - General Physics $$$ Resistivity and Ohm’s Law"],
            ["gp-23", "2E - General Physics $$$ Kirchhoff’s Laws"],
            ["gp-24", "2E - General Physics $$$ Magnetic Forces and Fields"],
            ["gp-25", "2E - General Physics $$$ Faraday’s Law"],
            ["gp-26", "2E - General Physics $$$ Snell’s Law and Total Internal Reflection"],
            ["gp-27", "2E - General Physics $$$ Interference"],
            ["gp-28", "2E - General Physics $$$ Geometric Optics, Ray Tracing, and Image Formation"],

            ["gc-1", "2E - General Chemistry $$$ Introduction to Science"],
            ["gc-2", "2E - General Chemistry $$$ General Chemistry Lab Safety"],
            ["gc-3", "2E - General Chemistry $$$ Chemical Nomenclature"],
            ["gc-4", "2E - General Chemistry $$$ Compound Formulas"],
            ["gc-5", "2E - General Chemistry $$$ Qualitative Analysis of Reactions"],
            ["gc-6", "2E - General Chemistry $$$ Electron Configuration"],
            ["gc-7", "2E - General Chemistry $$$ Chemical Bonding"],
            ["gc-8", "2E - General Chemistry $$$ Gas Laws"],
            ["gc-9", "2E - General Chemistry $$$ Enthalpy and Specific Heat"],
            ["gc-10", "2E - General Chemistry $$$ Acid-Base Titrations"],
            ["gc-11", "2E - General Chemistry $$$ Gravimetric Analysis"],
            ["gc-12", "2E - General Chemistry $$$ Molar Mass and Freezing Point Depression"],
            ["gc-13", "2E - General Chemistry $$$ Molar Volume of Gases"],
            ["gc-14", "2E - General Chemistry $$$ Molar Mass and Vapor Density"],
            ["gc-15", "2E - General Chemistry $$$ Nuclear Chemistry"],
            ["gc-16", "2E - General Chemistry $$$ Reaction Rates"],
            ["gc-17", "2E - General Chemistry $$$ Equilibrium Constants"],
            ["gc-18", "2E - General Chemistry $$$ Preparation of Buffer Solutions"],
            ["gc-19", "2E - General Chemistry $$$ Standardization of a Solution"],
            ["gc-20", "2E - General Chemistry $$$ Titration Indicators"],
            ["gc-21", "2E - General Chemistry $$$ Oxidation-Reduction Reactions"],
            ["gc-22", "2E - General Chemistry $$$ Separation by Chromatography"],
            ["gc-23", "2E - General Chemistry $$$ Electrochemical Series"],
            ["gc-24", "2E - General Chemistry $$$ Electrochemical Cells"],
            ["gc-25", "2E - General Chemistry $$$ Organic Compounds"],
            ["gc-26", "2E - General Chemistry $$$ Coordination Compounds and Isomers"],

            ["ib-1", "2E - Introductory Biology $$$ Introduction to Science"],
            ["ib-2", "2E - Introductory Biology $$$ General Lab Safety"],
            ["ib-3", "2E - Introductory Biology $$$ Chemical Bonding Fundamentals"],
            ["ib-4", "2E - Introductory Biology $$$ Introduction to the Microscope"],
            ["ib-5", "2E - Introductory Biology $$$ The Chemistry of Life"],
            ["ib-6", "2E - Introductory Biology $$$ Diffusion"],
            ["ib-7", "2E - Introductory Biology $$$ Osmosis"],
            ["ib-8", "2E - Introductory Biology $$$ Enzymes"],
            ["ib-9", "2E - Introductory Biology $$$ Cellular Respiration"],
            ["ib-10", "2E - Introductory Biology $$$ Cell Structure and Function"],
            ["ib-11", "2E - Introductory Biology $$$ Mitosis"],
            ["ib-12", "2E - Introductory Biology $$$ Meiosis"],
            ["ib-13", "2E - Introductory Biology $$$ DNA and RNA"],
            ["ib-14", "2E - Introductory Biology $$$ Mendelian Genetics"],
            ["ib-15", "2E - Introductory Biology $$$ Population Genetics"],
            ["ib-16", "2E - Introductory Biology $$$ Taxonomy"],
            ["ib-17", "2E - Introductory Biology $$$ Bacteria and Archaea"],
            ["ib-18", "2E - Introductory Biology $$$ Protista"],
            ["ib-19", "2E - Introductory Biology $$$ Fungi"],
            ["ib-20", "2E - Introductory Biology $$$ Energy and Photosynthesis"],
            ["ib-21", "2E - Introductory Biology $$$ Plant Circulation"],
            ["ib-22", "2E - Introductory Biology $$$ Plant Reproduction"],
            ["ib-23", "2E - Introductory Biology $$$ Invertebrates and Vertebrates"],
            ["ib-24", "2E - Introductory Biology $$$ Animal Structure"],
            ["ib-25", "2E - Introductory Biology $$$ The Circulatory and Respiratory Systems"],
            ["ib-26", "2E - Introductory Biology $$$ The Sensory and Nervous Systems"],
            ["ib-27", "2E - Introductory Biology $$$ Ecology of Organisms"],
            ["ib-28", "2E - Introductory Biology $$$ Ecological Interactions"],

            ["ap-1", "2E - Anatomy and Physiology $$$ Introduction to Science"],
            ["ap-2", "2E - Anatomy and Physiology $$$ Cell Structure and Function"],
            ["ap-3", "2E - Anatomy and Physiology $$$ Mitosis and Meiosis"],
            ["ap-4", "2E - Anatomy and Physiology $$$ Diffusion and Osmosis"],
            ["ap-5", "2E - Anatomy and Physiology $$$ Tissues and Skin"],
            ["ap-6", "2E - Anatomy and Physiology $$$ The Skeletal System"],
            ["ap-7", "2E - Anatomy and Physiology $$$ The Muscular System"],
            ["ap-8", "2E - Anatomy and Physiology $$$ The Nervous System"],
            ["ap-9", "2E - Anatomy and Physiology $$$ The Endocrine System"],
            ["ap-10", "2E - Anatomy and Physiology $$$ Blood and the Heart"],
            ["ap-11", "2E - Anatomy and Physiology $$$ The Circulatory System"],
            ["ap-12", "2E - Anatomy and Physiology $$$ The Lymphatic System and Immunity"],
            ["ap-13", "2E - Anatomy and Physiology $$$ The Respiratory System"],
            ["ap-14", "2E - Anatomy and Physiology $$$ The Urinary System"],
            ["ap-15", "2E - Anatomy and Physiology $$$ Electrolytes, Water, Acids & Bases"],
            ["ap-16", "2E - Anatomy and Physiology $$$ The Digestive System"],
            ["ap-17", "2E - Anatomy and Physiology $$$ Nutrition"],
            ["ap-18", "2E - Anatomy and Physiology $$$ The Reproductive System"],

            ["mb-1", "2E - Microbiology $$$ Introduction to Science"],
            ["mb-2", "2E - Microbiology $$$ Microbiology Lab Safety"],
            ["mb-3", "2E - Microbiology $$$ Introduction to the Microscope"],
            ["mb-4", "2E - Microbiology $$$ Introduction to Culturing and Aseptic Technique"],
            ["mb-5", "2E - Microbiology $$$ Structure and Microscopy"],
            ["mb-6", "2E - Microbiology $$$ Growth of Microorganisms"],
            ["mb-7", "2E - Microbiology $$$ Quantitation of Cultured Microorganisms"],
            ["mb-8", "2E - Microbiology $$$ Selective Media and Agar"],
            ["mb-9", "2E - Microbiology $$$ Differential and Biochemical Tests"],
            ["mb-10", "2E - Microbiology $$$ Eukaryotic Microbes,Parasitology, and Viruses"],
            ["mb-11", "2E - Microbiology $$$ Food Microbiology"],
            ["mb-12", "2E - Microbiology $$$ Environmental Microbiology and Water Quality"],
            ["mb-13", "2E - Microbiology $$$ Microbial Genetics and Genetic Engineering"],

            ["ic-1", "2E - Introductory Chemistry $$$ Laboratory Safety and Procedures"],
            ["ic-2", "2E - Introductory Chemistry $$$ Thinking Like a Chemist: The Scientific Method"],
            ["ic-3", "2E - Introductory Chemistry $$$ Data Analysis and Graphing"],
            ["ic-4", "2E - Introductory Chemistry $$$ Types of Matter"],
            ["ic-5", "2E - Introductory Chemistry $$$ Exploring Solubility"],
            ["ic-6", "2E - Introductory Chemistry $$$ Examination of Physical and Chemical Properties"],
            ["ic-7", "2E - Introductory Chemistry $$$ Measuring Heats of Reactions"],
            ["ic-8", "2E - Introductory Chemistry $$$ Distinguishing Between Endothermic and Exothermic Reactions"],
            ["ic-9", "2E - Introductory Chemistry $$$ Electron Configuration"],
            ["ic-10", "2E - Introductory Chemistry $$$ Electromagnetic Radiation"],
            ["ic-11", "2E - Introductory Chemistry $$$ Molecular Geometry: The VSEPR Mode"],
            ["ic-12", "2E - Introductory Chemistry $$$ Types of Chemical Bonds"],
            ["ic-13", "2E - Introductory Chemistry $$$ Bond Polarity and Dipole Moments"],
            ["ic-14", "2E - Introductory Chemistry $$$ Evaluating Precipitation Reactions"],
            ["ic-15", "2E - Introductory Chemistry $$$ Types of Chemical Reactions"],
            ["ic-16", "2E - Introductory Chemistry $$$ Oxidation-Reduction Reactions"],
            ["ic-17", "2E - Introductory Chemistry $$$ Molar Mass"],
            ["ic-18", "2E - Introductory Chemistry $$$ Periodic Trends in Atomic Properties"],
            ["ic-19", "2E - Introductory Chemistry $$$ Stoichiometric Calculations:Reactants and Products"],
            ["ic-20", "2E - Introductory Chemistry $$$ Using the Ideal Gas Law"],
            ["ic-21", "2E - Introductory Chemistry $$$ Exploring Reaction Rates"],
            ["ic-22", "2E - Introductory Chemistry $$$ Chemical Kinetics and Catalysis"],
            ["ic-23", "2E - Introductory Chemistry $$$ The Nature of Acids and Bases:Exploring the pH Scale"],
            ["ic-24", "2E - Introductory Chemistry $$$ Titrations and Equivalence Points"],

            ["as-1", "2E - Astronomy $$$ The Scientific Method"],
            ["as-2", "2E - Astronomy $$$ Units and Signifcant Figures"],
            ["as-3", "2E - Astronomy $$$ Observing the Night Sky"],
            ["as-4", "2E - Astronomy $$$ The Scale of the Solar System"],
            ["as-5", "2E - Astronomy $$$ Our Place in the Universe"],
            ["as-6", "2E - Astronomy $$$ The Sun and The Moon"],
            ["as-7", "2E - Astronomy $$$ Parallax"],
            ["as-8", "2E - Astronomy $$$ Orbital Motion"],
            ["as-9", "2E - Astronomy $$$ Planetary Rotation"],
            ["as-10", "2E - Astronomy $$$ Gravity"],
            ["as-11", "2E - Astronomy $$$ The Electromagnetic Spectrum"],
            ["as-12", "2E - Astronomy $$$ The Doppler Effect"],

            ["gb-1", "2E - General Biology $$$ Introduction to Science"],
            ["gb-2", "2E - General Biology $$$ General Lab Safety"],
            ["gb-3", "2E - General Biology $$$ Chemical Bonding Fundamentals"],
            ["gb-4", "2E - General Biology $$$ Introduction to the Microscope"],
            ["gb-5", "2E - General Biology $$$ The Chemistry of Life"],
            ["gb-6", "2E - General Biology $$$ Diffusion and Osmosis"],
            ["gb-7", "2E - General Biology $$$ Enzyme Catalysis"],
            ["gb-8", "2E - General Biology $$$ Metabolism"],
            ["gb-9", "2E - General Biology $$$ Hierarchies of Life"],
            ["gb-10", "2E - General Biology $$$ Unicellular Organisms"],
            ["gb-11", "2E - General Biology $$$ Mitosis and Meiosis"],
            ["gb-12", "2E - General Biology $$$ Transcription and Translation"],
            ["gb-13", "2E - General Biology $$$ Genetics of Organisms"],
            ["gb-14", "2E - General Biology $$$ Biomolecular Techniques"],
            ["gb-15", "2E - General Biology $$$ Plant Pigments and Photosynthesis"],
            ["gb-16", "2E - General Biology $$$ Plant Transpiration"],
            ["gb-17", "2E - General Biology $$$ Plant Reproduction"],
            ["gb-18", "2E - General Biology $$$ Mammalian Homeostasis"],
            ["gb-19", "2E - General Biology $$$ Invertebrates"],
            ["gb-20", "2E - General Biology $$$ Vertebrates"],
            ["gb-21", "2E - General Biology $$$ Animal Behavior and Zoology"],
            ["gb-22", "2E - General Biology $$$ Ecology of Organisms"],
            ["gb-23", "2E - General Biology $$$ Ecological Interactions"],
            ["gb-24", "2E - General Biology $$$ Environmental Succession"],

            ["es-1", "3E - Environmental Science $$$ Introduction to Science"],
            ["es-2", "3E - Environmental Science $$$ Scientific Measurements"],
            ["es-3", "3E - Environmental Science $$$ Ecosystems"],
            ["es-4", "3E - Environmental Science $$$ Ecology of Organisms"],
            ["es-5", "3E - Environmental Science $$$ Biodiversity"],
            ["es-6", "3E - Environmental Science $$$ Population Biology"],
            ["es-7", "3E - Environmental Science $$$ Rock and Mineral Resources"],
            ["es-8", "3E - Environmental Science $$$ Soil Quality and Contamination"],
            ["es-9", "3E - Environmental Science $$$ Oceans and Coasts"],
            ["es-10", "3E - Environmental Science $$$ Water Quality and Contamination"],
            ["es-11", "3E - Environmental Science $$$ Weather and The Atmosphere"],
            ["es-12", "3E - Environmental Science $$$ Air Quality and Contamination"],
            ["es-13", "3E - Environmental Science $$$ Climate Change"],
            ["es-14", "3E - Environmental Science $$$ Energy Resources"],

            ["fs-1", "2E - Forensics $$$ Evidence and Crime Scenes"],
            ["fs-2", "2E - Forensics $$$ Fingerprinting"],
            ["fs-3", "2E - Forensics $$$ DNA"],
            ["fs-4", "2E - Forensics $$$ Blood"],
            ["fs-5", "2E - Forensics $$$ Fiber and Hair"],
            ["fs-6", "2E - Forensics $$$ Impression Evidence: Shoes, Tires, Tools"],
            ["fs-7", "2E - Forensics $$$ Fractography and Glass"],
            ["fs-8", "2E - Forensics $$$ Autopsy and Time of Death"],
            ["fs-9", "2E - Forensics $$$ Body Identification"],
            ["fs-10", "2E - Forensics $$$ Questioned Documents"],
            ["fs-11", "2E - Forensics $$$ Arson"],
            ["fs-12", "2E - Forensics $$$ Toxicology"],
            ["fs-13", "2E - Forensics $$$ Firearms"],

            ["gp-1", "2E - General Physics $$$ Introduction to Science"],
            ["gp-2", "2E - General Physics $$$ General Lab Safety"],
            ["gp-3", "2E - General Physics $$$ Measurements and Uncertainty"],
            ["gp-4", "2E - General Physics $$$ 1-D Kinematics"],
            ["gp-5", "2E - General Physics $$$ 2-D Kinematics and Projectile Motion"],
            ["gp-6", "2E - General Physics $$$ Newton’s Laws"],
            ["gp-7", "2E - General Physics $$$ Circular Motion"],
            ["gp-8", "2E - General Physics $$$ Gravity"],
            ["gp-9", "2E - General Physics $$$ Conservation of Energy"],
            ["gp-10", "2E - General Physics $$$ Conservation of Momentum"],
            ["gp-11", "2E - General Physics $$$ Torque and Static Equilibrium"],
            ["gp-12", "2E - General Physics $$$ Buoyant Force and Archimedes Principle"],
            ["gp-13", "2E - General Physics $$$ Simple Harmonic Motion"],
            ["gp-14", "2E - General Physics $$$ Properties of Waves"],
            ["gp-15", "2E - General Physics $$$ Ideal Gas Law"],
            ["gp-16", "2E - General Physics $$$ First Law of Thermodynamics"],
            ["gp-17", "2E - General Physics $$$ Second Law of Thermodynamics and Entropy"],
            ["gp-18", "2E - General Physics $$$ Electric Charge and Coulomb’s Law"],
            ["gp-19", "2E - General Physics $$$ Electric Field and Potential"],
            ["gp-20", "2E - General Physics $$$ Gauss’s Law"],
            ["gp-21", "2E - General Physics $$$ Capacitance"],
            ["gp-22", "2E - General Physics $$$ Resistivity and Ohm’s Law"],
            ["gp-23", "2E - General Physics $$$ Kirchhoff’s Laws"],
            ["gp-24", "2E - General Physics $$$ Magnetic Forces and Fields"],
            ["gp-25", "2E - General Physics $$$ Faraday’s Law"],
            ["gp-26", "2E - General Physics $$$ Snell’s Law and Total Internal Reflection"],
            ["gp-27", "2E - General Physics $$$ Interference"],
            ["gp-28", "2E - General Physics $$$ Geometric Optics, Ray Tracing, and Image Formation"],

            ["ip-1", "2E - Introductory Physics $$$ Introduction to Science"],
            ["ip-2", "2E - Introductory Physics $$$ General Lab Safety"],
            ["ip-3", "2E - Introductory Physics $$$ Measurements and Uncertainty"],
            ["ip-4", "2E - Introductory Physics $$$ 1-D Kinematics"],
            ["ip-5", "2E - Introductory Physics $$$ 2-D Kinematics and Projectile Motion"],
            ["ip-6", "2E - Introductory Physics $$$ Newton’s Laws"],
            ["ip-7", "2E - Introductory Physics $$$ Friction"],
            ["ip-8", "2E - Introductory Physics $$$ Circular Motion"],
            ["ip-9", "2E - Introductory Physics $$$ Gravity"],
            ["ip-10", "2E - Introductory Physics $$$ Conservation of Energy"],
            ["ip-11", "2E - Introductory Physics $$$ Conservation of Momentum"],
            ["ip-12", "2E - Introductory Physics $$$ Center of Mass"],
            ["ip-13", "2E - Introductory Physics $$$ Buoyant Force and Archimedes Principle"],
            ["ip-14", "2E - Introductory Physics $$$ Properties of Waves"],
            ["ip-15", "2E - Introductory Physics $$$ Ideal Gas Law"],
            ["ip-16", "2E - Introductory Physics $$$ Latent Heat and Specific Heat"],
            ["ip-17", "2E - Introductory Physics $$$ First Law of Thermodynamics"],
            ["ip-18", "2E - Introductory Physics $$$ Second Law of Thermodynamics and Entropy"],
            ["ip-19", "2E - Introductory Physics $$$ Electric Charge and Coulomb’s Law"],
            ["ip-20", "2E - Introductory Physics $$$ Electric Field and Potential"],
            ["ip-21", "2E - Introductory Physics $$$ Capacitance"],
            ["ip-22", "2E - Introductory Physics $$$ Resistivity and Ohm’s Law"],
            ["ip-23", "2E - Introductory Physics $$$ Magnetic Forces and Fields"],
            ["ip-24", "2E - Introductory Physics $$$ Snell’s Law and Total Internal Reflection"],
            ["ip-25", "2E - Introductory Physics $$$ Interference"],
            ["ip-26", "2E - Introductory Physics $$$ Geometric Optics, Ray Tracing, and Image Formation"],
            ["ip-27", "2E - Introductory Physics $$$ Ecology of Organisms"],
            ["ip-28", "2E - Introductory Physics $$$ Ecological Interactions"],

            ["hb-1", "2E - Human Biology $$$ Introduction to Science"],
            ["hb-2", "2E - Human Biology $$$ Basic Biochemistry"],
            ["hb-3", "2E - Human Biology $$$ Cellular Anatomy and Physiology"],
            ["hb-4", "2E - Human Biology $$$ Metabolism"],
            ["hb-5", "2E - Human Biology $$$ Cellular Reproduction"],
            ["hb-6", "2E - Human Biology $$$ Human Molecular Genetics"],
            ["hb-7", "2E - Human Biology $$$ Population Genetics and Evolution"],
            ["hb-8", "2E - Human Biology $$$ Anatomical Orientation"],
            ["hb-9", "2E - Human Biology $$$ Developmental Biology"],
            ["hb-10", "2E - Human Biology $$$ Sensory and The Nervous System"],
            ["hb-11", "2E - Human Biology $$$ The Musculoskeletal System"],
            ["hb-12", "2E - Human Biology $$$ The Cardiovascular System"],
            ["hb-13", "2E - Human Biology $$$ The Excretory System"],
            ["hb-14", "2E - Human Biology $$$ Nutrition"],
            ["hb-15", "2E - Human Biology $$$ Immunology"],
            ["hb-16", "2E - Human Biology $$$ Aging and Disease"],

            ["hg-1", "2E - Historical Geology $$$ Introduction to Science"],
            ["hg-2", "2E - Historical Geology $$$ Geologic Time and the Solar System"],
            ["hg-3", "2E - Historical Geology $$$ Geologic Dating: Absolute and Relative"],
            ["hg-4", "2E - Historical Geology $$$ Earth Materials and Sedimentary Rocks"],
            ["hg-5", "2E - Historical Geology $$$ Weathering and Sediment Formation"],
            ["hg-6", "2E - Historical Geology $$$ Environments of Deposition"],
            ["hg-7", "2E - Historical Geology $$$ Stratigraphic Correlations"],
            ["hg-8", "2E - Historical Geology $$$ Fossilization"],
            ["hg-9", "2E - Historical Geology $$$ Fossil Identification"],
            ["hg-10", "2E - Historical Geology $$$ Map Reading"],
            ["hg-11", "2E - Historical Geology $$$ Geologic Maps"],
            ["hg-12", "2E - Historical Geology $$$ Plate Tectonics"],
            ["hg-13", "2E - Historical Geology $$$ Evolution"],
            ["hg-14", "2E - Historical Geology $$$ Fossil Fuels"],
            ["hg-15", "2E - Historical Geology $$$ Transgressions and Regressions"],

            ["sg-1", "2E - Physical Geology Standard $$$ Building a Planet"],
            ["sg-2", "2E - Physical Geology Standard $$$ Plate Tectonics and Earthquakes"],
            ["sg-3", "2E - Physical Geology Standard $$$ Minerals"],
            ["sg-4", "2E - Physical Geology Standard $$$ Igneous Rocks"],
            ["sg-5", "2E - Physical Geology Standard $$$ Sedimentary Rocks"],
            ["sg-6", "2E - Physical Geology Standard $$$ Metamorphic Rocks"],
            ["sg-7", "2E - Physical Geology Standard $$$ Geologic Dating and Fossilization"],
            ["sg-8", "2E - Physical Geology Standard $$$ Weathering and Erosion"],
            ["sg-9", "2E - Physical Geology Standard $$$ Groundwater"],
            ["sg-10", "2E - Physical Geology Standard $$$ Fluvial Processes and Landforms"],
            ["sg-11", "2E - Physical Geology Standard $$$ Wind Processes and Landforms"],
            ["sg-12", "2E - Physical Geology Standard $$$ Glacial Processes and Landforms"],
            ["sg-13", "2E - Physical Geology Standard $$$ Topographic Maps"],
            ["sg-14", "2E - Physical Geology Standard $$$ Geologic Maps"],
            ["sg-15", "2E - Physical Geology Standard $$$ Earth’s Mineral and Energy Resources"],

            ["bg-1", "2E - Physical Geology Basic $$$ Plate Tectonics and Earthquakes"],
            ["bg-2", "2E - Physical Geology Basic $$$ Minerals"],
            ["bg-3", "2E - Physical Geology Basic $$$ Igneous Rocks"],
            ["bg-4", "2E - Physical Geology Basic $$$ Sedimentary Rocks"],
            ["bg-5", "2E - Physical Geology Basic $$$ Metamorphic Rocks"],
            ["bg-6", "2E - Physical Geology Basic $$$ Weathering and Erosion"],
            ["bg-7", "2E - Physical Geology Basic $$$ Geologic Dating"],
            ["bg-8", "2E - Physical Geology Basic $$$ Mapping"],

            ["rm-1", "2E - Physical Geology Rocks & Mineral $$$ Plate Tectonics and Earthquakes"],
            ["rm-2", "2E - Physical Geology Rocks & Mineral $$$ Minerals"],
            ["rm-3", "2E - Physical Geology Rocks & Mineral $$$ Igneous Rocks"],
            ["rm-4", "2E - Physical Geology Rocks & Mineral $$$ Sedimentary Rocks"],
            ["rm-5", "2E - Physical Geology Rocks & Mineral $$$ Metamorphic Rocks"],

            ["pt-1", "2E - Pharmacy Technician $$$ Measurement"],
            ["pt-2", "2E - Pharmacy Technician $$$ Equipment Practice"],
            ["pt-3", "2E - Pharmacy Technician $$$ Compounding"],
            ["pt-4", "2E - Pharmacy Technician $$$ Emulsions and Elixirs"],
            ["pt-5", "2E - Pharmacy Technician $$$ Labeling and Packing"],
            ["pt-6", "2E - Pharmacy Technician $$$ Preparing Investigational Drugs"]

        ]);

        function labList(prop) {
            let formatDataArray = [];

            formatDataArray.push([{
                text: 'Lab Details',
                style: 'tableHeader',
                colSpan: 3,
                alignment: 'center',
                color: '#ffffff',
                fontSize: 20,
                fillColor: '#0066cc'
            }, {}, {}]);

            formatDataArray.push([{
                text: 'Subject',
                style: 'tableHeader',
                alignment: 'center',
                color: '#ffffff',
                fontSize: 20,
                fillColor: '#0066cc'
            },
            {
                text: 'Lab Topic',
                style: 'tableHeader',
                alignment: 'center',
                color: '#ffffff',
                fontSize: 20,
                fillColor: '#0066cc'
            },
            {
                text: 'Lab #',
                style: 'tableHeader',
                alignment: 'center',
                color: '#ffffff',
                fontSize: 20,
                fillColor: '#0066cc'
            }
            ]);


            let labs = prop.txt.split(' ');
            let labCount = 1;

            labs.forEach(element => {
                let labComplex = labsMap.get(element.trim()).split("$$$");
                let obj1 = {
                    text: labComplex[0].trim(),
                    fontSize: 14
                };
                let obj2 = {
                    text: labComplex[1].trim(),
                    fontSize: 14
                };
                let obj3 = {
                    text: labCount,
                    fontSize: 14
                };

                let eachLabArray = [];
                eachLabArray.push(obj1);
                eachLabArray.push(obj2);
                eachLabArray.push(obj3);

                formatDataArray.push(eachLabArray);

                labCount++;
            });

            return formatDataArray;
        }

        function notesIfAny(prop) {
            let returnObj = {
                style: 'tableTerms',
                color: '#000000',
                table: {
                    widths: ['*'],
                    headerRows: 1,
                    // keepWithHeaderRows: 1,
                    body: [
                        [{
                            text: 'NOTES:',
                            style: 'tableHeader',
                            alignment: 'center',
                            color: '#ffffff',
                            fontSize: 20,
                            fillColor: '#0066cc'
                        }],
                        [{
                            fontSize: 14,
                            lineHeight: 1.4,
                            alignment: 'justify',
                            type: 'none',
                            ul: [
                                prop.notes.split('\n')
                            ]
                        }],

                    ]
                }
            }

            if (prop.notes.length > 0) {
                return returnObj;
            } else {
                return null;
            }

        }
        let docDefinition = {

            info: {
                title: `eScience Labs Proposal-${prop.pDescription}`,
                author: `${req.user.fName} ${req.user.lName}`,
                subject: `${prop.pDescription}`,
                keywords: `${prop.institution},${prop.instructor},${prop.pDescription}`,
            },
            pageSize: 'a4',
            pageMargins: [20, 70, 20, 40],
            header: function (currentPage, pageCount) {
                return {
                    table: {
                        widths: [560],
                        body: [
                            [{
                                text: `\n eScience Labs Proposal by: \n ${req.user.fName} ${req.user.lName}, ${req.user.desig} \n 888-ESL KITS | ${req.user.email}`,
                                style: 'header'
                            }]
                        ]
                    },
                    layout: 'noBorders'
                };
            },
            footer: function (currentPage, pageCount) {
                return {
                    table: {
                        widths: [200, 350],
                        body: [
                            [{
                                text: 'CONFIDENTIAL',
                                alignment: 'center',
                                fontSize: 18,
                                bold: true,
                                color: '#ff0000'
                            },
                            {
                                text: 'Page ' + (currentPage + 1),
                                alignment: 'right',
                                fontSize: 18,
                                bold: true
                            }
                            ]
                        ]
                    },
                    layout: 'noBorders'
                };
            },
            content: [

                // NEW PAGE FOR LIST OF LABS

                {
                    // pageBreak: 'before',
                    text: 'Most Labs Have Multiple Experiments',
                    style: 'header',
                    style: 'lineSpacing',
                    alignment: 'left',
                    color: '#000000',
                    fontSize: 18,
                    bold: true
                },
                {
                    style: 'tableIntro',
                    color: '#000000',
                    table: {
                        widths: [150, '*', 40],
                        headerRows: 2,
                        // keepWithHeaderRows: 1,
                        body: labList(prop)
                    }
                },

                notesIfAny(prop),

                // NEW PAGE FOR TERMS AND CONDITIONS

                {
                    pageBreak: 'before',
                    style: 'tableTerms',
                    color: '#000000',
                    table: {
                        widths: ['*'],
                        headerRows: 1,
                        // keepWithHeaderRows: 1,
                        body: [
                            [{
                                text: 'STANDARD TERMS AND CONDITIONS',
                                style: 'tableHeader',
                                alignment: 'center',
                                color: '#ffffff',
                                fontSize: 20,
                                fillColor: '#0066cc'
                            }],
                            [{
                                fontSize: 14,
                                lineHeight: 1.4,
                                alignment: 'justify',
                                ul: [
                                    'Standard payment terms will be Prepaid (PPD) or Net 30 pending credit approval.',
                                    'eScience Labs will coordinate all logistics pertaining to kit shipments to ensure on time delivery for students.',
                                    'Missing or broken items will be replaced at no cost to the student or school.',
                                    'Purchase orders are required 90 days prior to course start date to ensure on time delivery of materials.',
                                    '50 kit minimum required for custom kit orders.',
                                    'Prices are subject to change. eScience Labs reserves the right to adjust price of lab kits due to material’s modifications and course developer revisions.',
                                    'Customer understands that eScience Labs’ products may contain potentially harmful items and/or chemicals that could cause injury if misused; that these products should be used only as directed; and that they should be safely stored out of the reach of children and pets.',
                                    'To the extent possible, Customer will ensure that end user(s) are encouraged to completely read and fully understand all the safety precautions noted in the accompanying lab manual and view the safety video at www.esciencelabs.com before any experimentation is conducted.',
                                    'Customer will further encourage user(s) to follow all safety precautions and perform the experiments exactly as directed in the lab manual.',
                                    'Customer agrees not to remove any safety equipment and/or directions provided by eScience Labs, Inc.',
                                    'Customer and eScience Labs, LLC. both agree that all terms in this proposal are confidential and are not to be shared with any outside party.',
                                ]
                            }],

                        ]
                    },
                },
                {
                    image: 'data:image/jpeg;base64,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',
                    fit: [400, 150],
                    alignment: 'center',
                    margin: [0, 0, 0, 0]
                }
            ],
            styles: {
                header: {
                    fontSize: 14,
                    bold: true,
                    alignment: 'right',
                    margin: [0, 0, 0, 0]
                },
                tableIntro: {
                    margin: [0, 5, 0, 15],
                    bold: true,
                    fontSize: 14,
                    color: 'black'
                },
                tableTerms: {
                    margin: [0, 5, 0, 15],
                    fontSize: 14,
                    color: 'black'
                },
                icon: {
                    font: 'Roboto'
                },
                lineSpacing: {
                    margin: [0, 0, 0, 20] //change number 6 to increase nspace
                }
            }

        };

        return docDefinition;
    }
};