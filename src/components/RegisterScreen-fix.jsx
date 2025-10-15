// TRECHO CORRIGIDO PARA SUBSTITUIR NO RegisterScreen.jsx (linhas 131-143)

            // Login bem-sucedido - agora salvar dados opcionais usando os mesmos nomes da EmpresaScreen
            const dadosOpcionais = {
              nome_empresa: formData.companyName,
              cnpj: formData.cnpj,
              email_corporativo: formData.corporateEmail,
              telefone: formData.contactPhone,
              site: formData.socialReason || "",
              whatsapp: "",
              descricao: "",
              setor: "",
              porte: "",
              data_fundacao: "",
              num_funcionarios: "",
              cep: formData.zipCode || "",
              rua: formData.street || "",
              numero: formData.number || "",
              complemento: formData.complement || "",
              bairro: formData.neighborhood || "",
              cidade: formData.city || "",
              estado: formData.state || ""
            };